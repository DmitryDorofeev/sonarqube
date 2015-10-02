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

package org.sonar.server.computation.step;

import java.util.HashMap;
import java.util.Map;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.sonar.api.utils.log.Logger;
import org.sonar.api.utils.log.Loggers;
import org.sonar.db.DbClient;
import org.sonar.db.DbSession;
import org.sonar.db.protobuf.DbFileSources;
import org.sonar.db.source.FileSourceDto;
import org.sonar.server.computation.batch.BatchReportReader;
import org.sonar.server.computation.component.TreeRootHolder;
import org.sonar.server.computation.scm.ScmInfo;

/**
 * Populates the {@link org.sonar.server.computation.scm.ScmInfoHolder}
 * <p/>
 */
public class LoadScmInfosStep implements ComputationStep {

  private static final Logger LOG = Loggers.get(LoadScmInfosStep.class);

  private final DbClient dbClient;
  private final BatchReportReader batchReportReader;
  private final TreeRootHolder treeRootHolder;

  public LoadScmInfosStep(DbClient dbClient, BatchReportReader batchReportReader, TreeRootHolder treeRootHolder) {
    this.batchReportReader = batchReportReader;
    this.dbClient = dbClient;
    this.treeRootHolder = treeRootHolder;
  }

  @Override
  public void execute() {
    // TODO read from batch or from db

    DbSession dbSession = dbClient.openSession(false);
    try {
      Map<String, ScmInfo> scmInfoCache = new HashMap<>();

      dbClient.fileSourceDao().selectSourcesByProjectUuid(dbSession, treeRootHolder.getRoot().getUuid(), new ResultHandler() {
        @Override
        public void handleResult(ResultContext context) {
          FileSourceDto fileSourceDto = ((FileSourceDto) context.getResultObject());
          DbFileSources.Data data = fileSourceDto.getSourceData();
          data.getLinesList();
        }
      });
    } finally {
      dbClient.closeSession(dbSession);
    }
  }

  @Override
  public String getDescription() {
    return "Load SCM info";
  }
}
