import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { Chart } from '../../e2elib/lib/src/pageobjects/chart/chart.component';
import { PanelBase } from '../../libappbase/panelbase';
import { getHtmlContent } from '../../libappbase/utils';

export class FormAdherenceToMPS extends Form {
  public pnlAdherenceAbsolute = new PanelAdherenceAbsolute();
  public pnlAdherenceCumulative = new PanelAdherenceCumulative();

  public constructor() {
    super('FormAdherenceToMPS');
  }
}

export class PanelAdherenceAbsolute extends PanelBase {
  public chartAdherenceAbsolute = new Chart('ChartAdherenceToMPSAgainstTarget');

  public async getQuantityFromChartTooltip(legendGroupItem: ChartAdherenceAbsoluteLegendGroupItem, xLabel: string): Promise<string> {
    let legend = '';
    switch (legendGroupItem) {
      case ChartAdherenceAbsoluteLegendGroupItem.Fulfillment:
        legend = ChartAdherenceAbsoluteLegendGroupItem.Fulfillment;
        break;
      case ChartAdherenceAbsoluteLegendGroupItem.MPSPlan:
        legend = ChartAdherenceAbsoluteLegendGroupItem.MPSPlan;
        break;
      case ChartAdherenceAbsoluteLegendGroupItem.OverFulfillment:
        legend = ChartAdherenceAbsoluteLegendGroupItem.OverFulfillment;
        break;
      case ChartAdherenceAbsoluteLegendGroupItem.UnderFulfillment:
        legend = ChartAdherenceAbsoluteLegendGroupItem.UnderFulfillment;
        break;
      default:
        break;
    }
    return <string>getHtmlContent(await this.chartAdherenceAbsolute.getTooltip('', legend, xLabel)).pop();
  }

  public constructor() {
    super('PanelAdherenceToMPSAgainstTarget');
  }
}

export class PanelAdherenceCumulative extends PanelBase {
  public chartAdherenceCumulative = new Chart('ChartAdherenceToMPS');

  public constructor() {
    super('PanelAdherenceToMPS');
  }
}

export enum ChartAdherenceAbsoluteLegendGroupItem {
  Fulfillment = 'Fulfillment',
  MPSPlan = 'MPS Plan',
  OverFulfillment = 'Over Fulfillment',
  UnderFulfillment = 'Under Fulfillment',
}
