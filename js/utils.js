/*
    Show
*/
function al_show(id)
{
    document.getElementById(id).setAttribute("collapsed","false");
}

/*
    Hide
*/
function al_hide(id)
{
    document.getElementById(id).setAttribute("collapsed","true");
}

/*
    Set value
*/
function al_setValue(id, value)
{
    document.getElementById(id).value = value;
}

/*
    Get value
*/
function al_getValue(id)
{
    return document.getElementById(id).value;
}

/*
    Change checkbox state
*/
function al_setCheckState(id, checkState)
{
    document.getElementById(id).setAttribute('checked', checkState);
}

function al_getCheckState(id)
{
    return document.getElementById(id).getAttribute('checked');
}

function getDaysInMonth(year, month)
{
    var days = 0;
    switch (month)
    {
        case 0:
        case 2:
        case 4:
        case 6:
        case 8:
        case 10:
            days = 31;
            break;
        case 1:
            if ((year % 4 == 0) &&
                !((year % 100 == 0) &&
                  (year % 400 != 0)))
            {
                days = 29;
            }
            else
            {
                days = 28;
            }
            break;
        case 3:
        case 5:
        case 7:
        case 9:
        case 11:
            days = 30;
            break;
    }
    return days;
}
