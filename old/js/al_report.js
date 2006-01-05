function initReportData()
{
    var today = new Date();
    var cYear = document.getElementById('report_date_year');
    var year = today.getFullYear();

    for (var i = -1; i < 10; i++)
        cYear.appendItem(year-i);
    cYear.selectedIndex = 1;

    var cMonth = document.getElementById('report_date_month');
    cMonth.selectedIndex = today.getMonth();

    reportDateChanged();
    var cDay = document.getElementById('report_date_day');
    cDay.selectedIndex = today.getDate()-1;
}

function reportDateChanged()
{
    var cYear = document.getElementById('report_date_year');
    var cMonth = document.getElementById('report_date_month');
    var cDay = document.getElementById('report_date_day');

    var days = getDaysInMonth(parseInt(cYear.selectedItem.label), cMonth.selectedIndex);

    if (days != cDay.menupopup.childNodes.length)
    {
        cDay.removeAllItems();
        for (var i = 0; i < days; i++)
            cDay.appendItem(i+1);
        cDay.selectedIndex = 0;
    }
}

function generateReport()
{
    var year = parseInt(document.getElementById('report_date_year').selectedItem.label);
    var month = document.getElementById('report_date_month').selectedIndex;
    var day = document.getElementById('report_date_day').selectedIndex;
    var utctime = String(Date.UTC(year, month, day+1));
    var days = al_getValue('report_days');

    var url ='cgi-bin/report.cgi?user='+g_user_name+'&password='+g_user_password+'&from='+utctime+'&days='+days;
    window.open(url);
}

