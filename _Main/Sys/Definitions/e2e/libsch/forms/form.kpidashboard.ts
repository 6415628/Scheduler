import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { Gauge } from '../../e2elib/lib/src/pageobjects/gauge.component';

export class FormKPIDashboard extends Form {
  public gaugeKPIProductivity = new Gauge('GaugeKPIProductivity');
  public gaugeKPIDeliveryPerformance = new Gauge('GaugeKPIDeliveryPerformance');
  public gaugeKPIOperationsScheduledEarly = new Gauge('GaugeKPIOperationsScheduledEarly');
  public gaugeKPIOperationsDueNotPlanned = new Gauge('GaugeKPIOperationsDueNotPlanned');
  public gaugeKPIBatchEfficiency = new Gauge('GaugeKPIBatchEfficiency');

  public constructor() {
    super('FormKPIDashboardScheduling');
  }
}
