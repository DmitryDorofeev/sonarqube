/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.batch.cache;

import com.google.common.base.Function;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.mutable.MutableBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.batch.bootstrap.ProjectDefinition;
import org.sonar.api.batch.bootstrap.ProjectReactor;
import org.sonar.api.utils.log.Loggers;
import org.sonar.api.utils.log.Profiler;
import org.sonar.batch.analysis.AnalysisProperties;
import org.sonar.batch.protocol.input.BatchInput.ServerIssue;
import org.sonar.batch.protocol.input.ProjectRepositories;
import org.sonar.batch.repository.ProjectRepositoriesLoader;
import org.sonar.batch.repository.ServerIssuesLoader;
import org.sonar.batch.repository.user.UserRepositoryLoader;

public class ProjectCacheSynchronizer {
  private static final Logger LOG = LoggerFactory.getLogger(ProjectCacheSynchronizer.class);

  private ProjectDefinition project;
  private AnalysisProperties properties;
  private ProjectRepositoriesLoader projectRepositoryLoader;
  private ServerIssuesLoader issuesLoader;
  private UserRepositoryLoader userRepository;
  private ProjectCacheStatus cacheStatus;

  public ProjectCacheSynchronizer(ProjectReactor project, ProjectRepositoriesLoader projectRepositoryLoader, AnalysisProperties properties,
    ServerIssuesLoader issuesLoader, UserRepositoryLoader userRepository, ProjectCacheStatus cacheStatus) {
    this.project = project.getRoot();
    this.projectRepositoryLoader = projectRepositoryLoader;
    this.properties = properties;
    this.issuesLoader = issuesLoader;
    this.userRepository = userRepository;
    this.cacheStatus = cacheStatus;
  }

  public void load(boolean force) {
    Date lastSync = cacheStatus.getSyncStatus(project.getKeyWithBranch());

    if (lastSync != null) {
      if (!force) {
        LOG.info("Found project [{}] cache [{}]", project.getKeyWithBranch(), lastSync);
        return;
      } else {
        LOG.info("-- Found project [{}] cache [{}], synchronizing data..", project.getKeyWithBranch(), lastSync);
      }
      cacheStatus.delete(project.getKeyWithBranch());
    } else {
      LOG.info("-- Cache for project [{}] not found, synchronizing data..", project.getKeyWithBranch());
    }

    loadData();
    saveStatus();
  }

  private void saveStatus() {
    cacheStatus.save(project.getKeyWithBranch());
    LOG.info("-- Succesfully synchronized project cache");
  }

  private void loadData() {
    Profiler profiler = Profiler.create(Loggers.get(ProjectCacheSynchronizer.class));
    profiler.startInfo("Load project repository");
    MutableBoolean fromCache = new MutableBoolean();
    ProjectRepositories projectRepo = projectRepositoryLoader.load(project, properties, fromCache);
    profiler.stopInfo(fromCache.booleanValue());

    if (projectRepo.lastAnalysisDate() == null) {
      LOG.debug("No previous analysis found");
      return;
    }

    profiler.startInfo("Load server issues");
    UserLoginAccumulator consumer = new UserLoginAccumulator();
    boolean isFromCache = issuesLoader.load(project.getKeyWithBranch(), consumer);
    profiler.stopInfo(isFromCache);

    profiler.startInfo("Load user information (" + consumer.loginSet.size() + " users)");
    for (String login : consumer.loginSet) {
      userRepository.load(login, null);
    }
    stopInfo(profiler, "Load user information", isFromCache);
  }

  private static class UserLoginAccumulator implements Function<ServerIssue, Void> {
    Set<String> loginSet = new HashSet<>();

    @Override
    public Void apply(ServerIssue input) {
      if (!StringUtils.isEmpty(input.getAssigneeLogin())) {
        loginSet.add(input.getAssigneeLogin());
      }
      return null;
    }
  }

  private static void stopInfo(Profiler profiler, String msg, boolean fromCache) {
    if (fromCache) {
      profiler.stopInfo(msg + " (done from cache)");
    } else {
      profiler.stopInfo(msg + " (done)");
    }
  }
}
