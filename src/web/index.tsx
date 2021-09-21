import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import './index.css';

import moment from 'moment';

const App = (): JSX.Element => {
  const currentMonth = 0;

  const currentDate = moment().add(currentMonth, 'months');

  // 現在表示している月が何日まであるかを算出
  const numOfMonth = currentDate.endOf('month').date();
  // この月の1日〜最終日までの配列
  const daysOfMonth = [...Array(numOfMonth).keys()].map(i => ++i);
  // 1日の曜日（0~6の数値で取得）日->0, 月->1, 火->2, 水->3, 木->4, 金->5, 土->6
  const firstWeekDay = currentDate.startOf('month').weekday();

  // 週ごとの二次元配列を生成
  const data = [...Array(6)].map((empty, weekIndex) =>
    [...Array(7)].map((empty, dayIndex) => {
      const i = 7 * weekIndex + dayIndex - firstWeekDay;
      if (i < 0 || daysOfMonth[i] === undefined) {
        return null;
      }
      return daysOfMonth[i];
    }),
  );

  // 全てnullの配列があれば除去する
  const calendarData = data.filter(
    week => week.filter(day => day != null).length > 0,
  );

  // 現在表示している月の前の月が何日まであるかを算出
  const copyCurrentDate = moment().add(currentMonth, 'months');

  const lastMonthDate = copyCurrentDate.subtract(1, 'months');
  const numOfDaysBeforeMonth = lastMonthDate.endOf('month').date();

  // 最初の週の前の月が表示されている日数を算出
  const numOfLastMonthDays = calendarData[0].filter(data => {
    return data == null;
  }).length;

  // 最終週の前の月が表示されている日数を算出
  const numOfNextMonthDays = calendarData[calendarData.length - 1].filter(
    data => {
      return data == null;
    },
  ).length;

  //カレンダーの配列に先月の日付と来月の日付を加える
  const completeCalendarData = calendarData.map((week, index) => {
    // 最初の週は前の月の日付を入れる
    if (index == 0) {
      let copyWeek = _.cloneDeep(week);
      for (let i = 0; i < numOfLastMonthDays; i++) {
        copyWeek[i] = numOfDaysBeforeMonth + i - numOfLastMonthDays + 1;
      }
      return copyWeek;
      // 最終週は次の月の日付を入れる
    } else if (index == calendarData.length - 1) {
      let copyWeek = _.cloneDeep(week);
      for (let i = 0; i < numOfNextMonthDays; i++) {
        copyWeek[6 - i] = numOfNextMonthDays - i;
      }
      return copyWeek;
    } else {
      return week;
    }
  });

  // カレンダーのテーブル要素を変更する
  const calendarHtml = completeCalendarData.map((week, index) => {
    const days = week.map(
      (day: React.ReactChild | null, index: React.Key | null) => {
        return <td key={index}>{day}</td>;
      },
    );
    return <tr key={index}>{days}</tr>;
  });

  console.log(2, currentDate);
  return (
    <div className="calendar-table-contents">
      {/* 月はmomentでは-1されて取得されるので1を追加する */}
      <div className="calendar-year">{currentDate.get('year')}</div>
      <div className="calendar-month">{currentDate.get('month') + 1}</div>
      <table>
        <tbody>
          <tr>
            <th>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th>SAT</th>
          </tr>
          {calendarHtml}
        </tbody>
      </table>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
