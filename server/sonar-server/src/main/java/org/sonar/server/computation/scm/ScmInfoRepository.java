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
package org.sonar.server.computation.scm;

import com.google.common.base.Optional;
import org.sonar.server.computation.component.Component;

/**
 * Return SCM information of components.
 *
 * It will always search in the db if there's nothing in the report.
 */
public interface ScmInfoRepository {

  /**
   * Returns Scm info for the specified component if there is any, first looking into the report, then into the database
   * It there's nothing in the report and in the db (on first analysis for instance), then it return a {@link Optional#absent()}.
   *
   * @throws NullPointerException if argument is {@code null}
   */
  Optional<ScmInfo> getScmInfo(Component component);
}
