export class GraphDataConverter {
  data = null;
  duration = null;
  constructor(data) {
    this.data = data;
  }


  getTimeFrame() {
    let range = this.data.reduce((acc, ele, ind) => {
      if (ele.startDate < acc.start) {
        acc.start = ele.startDate;
      }
      let d = new Date(ele.startDate);
      d.setMonth(d.getMonth() + ele.loanDuration);
      if ((ele.startDate + d.getTime()) > acc.end) {
        acc.end = ele.startDate + d.getTime();
      }
      return acc;
    }, {start: Number.MAX_VALUE, end: Number.MIN_VALUE});
    this.setDuration(range);
    return {"startDate" : (new Date(range.start)),
    "endDate" : (new Date(range.end)) }
  }

  setDuration(range) {
    let to = new Date(range.end);
    let from = new Date(range.start);
    this.duration = to.getMonth() - from.getMonth()
       + (12 * (to.getFullYear() - from.getFullYear()));
  }
  getDuration() {
    return this.duration;
  }

  getPortfolioValueAtGivenDate(millis) {
    let totalValue = [];
    this.data.forEach(loan => {
      let d = new Date(loan.startDate);
      d.setMonth(d.getMonth() + loan.loanDuration);
      if (millis < loan.startDat) {
        return;
      } else if (millis > (loan.startDate + d.getTime())) {
        totalValue.push((loan.principle * (1+loan.interestRate)));
        return;
      }
      let percent = (millis - loan.startDate) / (d.getTime() - loan.startDate);
      totalValue.push(((loan.principle * (1+loan.interestRate)) * percent));
    });
    return totalValue;
  }
}