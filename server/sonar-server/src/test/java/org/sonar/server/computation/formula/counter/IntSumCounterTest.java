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

package org.sonar.server.computation.formula.counter;

import com.google.common.base.Optional;
import org.junit.Test;
import org.sonar.server.computation.formula.CounterInitializationContext;
import org.sonar.server.computation.measure.Measure;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.guava.api.Assertions.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IntSumCounterTest {

  private final static String METRIC_KEY = "metric";

  CounterInitializationContext counterInitializationContext = mock(CounterInitializationContext.class);

  SumCounter sumCounter = new IntSumCounter(METRIC_KEY);

  @Test
  public void no_value_when_no_aggregation() {
    assertThat(sumCounter.getValue()).isAbsent();
  }

  @Test
  public void aggregate_from_context() {
    when(counterInitializationContext.getMeasure(METRIC_KEY)).thenReturn(Optional.of(Measure.newMeasureBuilder().create(10)));

    sumCounter.initialize(counterInitializationContext);

    assertThat(sumCounter.getValue().get()).isEqualTo(10);
  }

  @Test
  public void no_value_when_aggregate_from_context_but_no_measure() {
    when(counterInitializationContext.getMeasure(anyString())).thenReturn(Optional.<Measure>absent());

    sumCounter.initialize(counterInitializationContext);

    assertThat(sumCounter.getValue()).isAbsent();
  }

  @Test
  public void aggregate_from_counter() {
    when(counterInitializationContext.getMeasure(METRIC_KEY)).thenReturn(Optional.of(Measure.newMeasureBuilder().create(10)));
    SumCounter anotherCounter = new IntSumCounter(METRIC_KEY);
    anotherCounter.initialize(counterInitializationContext);

    sumCounter.aggregate(anotherCounter);

    assertThat(sumCounter.getValue().get()).isEqualTo(10);
  }

  @Test
  public void no_value_when_aggregate_from_empty_aggregator() {
    SumCounter anotherCounter = new IntSumCounter(METRIC_KEY);

    sumCounter.aggregate(anotherCounter);

    assertThat(sumCounter.getValue()).isAbsent();
  }

}
