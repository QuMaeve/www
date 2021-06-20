<?

include_once("..\link\link.php");
$sel_constructor = $_POST['sel_constructor'];
$d1 = $_POST['d1'];
$d2 = $_POST['d2'];
$viol_document_gi = $_POST['viol_document_gi'];
$y = $_POST['y'];
$fio_worker_m = $_POST['fio_worker_m'];
$w_m = $_POST['w_m'];

echo '<table  bordercolor="#000000" border="2">';
$c = 1;
//while (
$rows = 2;
//) {
//echo iconv("utf-8","windows-1251",$rows[1]);
echo '<tr><td>' . constructor_find($y, $viol_document_gi, $d1, $d2, $rows[0], $c) . '</td></tr>';
$c++;
//}
// $htmlText=$htmlText.;
echo '</table>';

function constructor_find($y, $viol_document_gi, $d1, $d2, $id, $c)
{
    if ($y > 0) {

        for ($x = 0; $x <= ($y - 1); $x++) {
// $docum=$docum.'<p>**'..'</p>';
            switch ($viol_document_gi[$x]) {
                case "1":
                    $docum = $docum . obr($d1, $d2, $id, $c);
                    break;
                case "2":
                    $docum = $docum . rasp($d1, $d2, $id, $c);
                    break;
                case "3":
                    $docum = $docum . zadan($d1, $d2, $id, $c);
                    break;
                case "4":
                    $docum = $docum . uved($d1, $d2, $id, $c);
                    break;
                case "5":
                    $docum = $docum . predoster($d1, $d2, $id, $c);
                    break;
                case "6":
                    $docum = $docum . act($d1, $d2, $id, $c);
                    break;
                case "7":
                    $docum = $docum . predpis($d1, $d2, $id, $c);
                    break;

                case "8":
                    $docum = $docum . uved_protocol($d1, $d2, $id, $c);
                    break;

                case "9":
                    $docum = $docum . protocol($d1, $d2, $id, $c);
                    break;
            }

        }

        return $docum;
    }
}

function obr($d1, $d2, $id, $c)
{
    $text = "";
    $q = 'SELECT  `num_incoming`, `incoming_date` FROM `incoming` 
join `link_complaints` on `link_complaints`.`id_incoming_c`=`incoming`.`id`
join `link_complaints_workers` on `link_complaints`.`id_complaints`= `link_complaints_workers`.`id_complants`
where 
 `incoming_date`>="' . $d1 . '" and  `incoming_date`<="' . $d2 . '"';
    //echo $q;
    $r = mysql_query($q);
    $oc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $oc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td></tr>';
    }
    $obr = '<div>&#1054;&#1073;&#1088;&#1072;&#1097;&#1077;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';

    return $obr;
}

function rasp($d1, $d2, $id, $c)
{
    $text = "";
    $q = 'SELECT  `num_order`, `date_order`, `Name_org` FROM `order`
join `link_order_workers` on `link_order_workers`.`id_order`=`order`.`id_order`
join `link_order_obj` on `link_order_obj`.`id_order`=`order`.`id_order`
join `complaints_obj` on `link_order_obj`.`id_obj_c`= `complaints_obj`. `id`

WHERE `date_order`>="' . $d1 . '" and `date_order`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td><td>' . iconv("utf-8", "windows-1251", $rows[2]) . '</td></tr>';
    }
    $rasp = '<div>&#1056;&#1072;&#1089;&#1087;&#1086;&#1088;&#1103;&#1078;&#1077;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $rasp;
}

function zadan($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT  `num`,  `date_tasks`FROM `tasks` 
join `link_task_workes` on `link_task_workes`.`id_tasks`=`tasks`.`id`
where  `date_tasks`>="' . $d1 . '" and `date_tasks`<="' . $d2 . '"';
    //echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td></tr>';
    }
    $zadan = '<div>&#1047;&#1072;&#1076;&#1072;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';

    return $zadan;
}

function uved($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT  `num`,  `date_notify` FROM `notify` 
where  `date_notify`>="' . $d1 . '" and `date_notify`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td></tr>';
    }
    $uved = '<div>&#1047;&#1072;&#1076;&#1072;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $uved;
}


function predoster($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT `num`, `date_caveat` FROM `caveat` 
WHERE  `date_caveat`>="' . $d1 . '" and `date_caveat`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td><td>' . iconv("utf-8", "windows-1251", $rows[2]) . '</td></tr>';
    }
    $predoster = '<div>&#1055;&#1088;&#1077;&#1076;&#1086;&#1089;&#1090;&#1077;&#1088;&#1077;&#1078;&#1077;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $predoster;
}

function act($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT  `num`, `date_act`, `Name_org` FROM `act` 
join `link_act_workes` on `link_act_workes`.`id_act`=`act`.`id`
join `complaints_obj` on `act`.`obj_id`= `complaints_obj`. `id`
where `date_act`>="' . $d1 . '" and `date_act`<="' . $d2 . '"';
    //echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td><td>' . iconv("utf-8", "windows-1251", $rows[2]) . '</td></tr>';
    }
    $act = '<div>&#1040;&#1082;&#1090;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $act;
}

function predpis($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT `num`, `Date_ordinance`, `Name_org` FROM `ordinance` 
     join `link_ordinance_workers` on `link_ordinance_workers`.`id_ordinance`=`ordinance`.`id` 
     join `complaints_obj` on `ordinance`.`id_obj`= `complaints_obj`.`id` 
 where `Date_ordinance`>="' . $d1 . '" and `Date_ordinance`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td><td>' . iconv("utf-8", "windows-1251", $rows[2]) . '</td></tr>';
    }
    $predpis = '<div>&#1055;&#1088;&#1077;&#1076;&#1087;&#1080;&#1089;&#1072;&#1085;&#1080;&#1103;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $predpis;
}

function uved_protocol($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT  `num`,  `date_notify` FROM `notify_protocol` 
join `link_u_protocol_workers` on `link_u_protocol_workers`.`id_u_protocol`=`notify_protocol`.`id`
where `date_notify`>="' . $d1 . '" and `date_notify`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td></tr>';
    }
    $uved_protocol = '<div>&#1059;&#1074;&#1077;&#1076;&#1086;&#1084;&#1083;&#1077;&#1085;&#1080;&#1077; &#1085;&#1072; &#1087;&#1088;&#1086;&#1090;&#1086;&#1082;&#1086;&#1083;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $uved_protocol;
}

function protocol($d1, $d2, $id, $c)
{
    $text = "";
    $q = ' SELECT  `num`, `Date_protocol`, `Name_org`  FROM `protocol`
join `link_protocol_workers` on `link_protocol_workers`.`id_protocol`=`protocol`.`id`
join `complaints_obj` on `protocol`.`id_obj`= `complaints_obj`. `id`
where `Date_protocol`>="' . $d1 . '" and `Date_protocol`<="' . $d2 . '"';
// echo $q;
    $r = mysql_query($q);
    $rc = 0;
    while ($rows = mysql_fetch_row($r)) {
        $rc++;
        $text = $text . '<tr><td>' . iconv("utf-8", "windows-1251", $rows[0]) . ' &#1086;&#1090; ' . iconv("utf-8", "windows-1251", $rows[1]) . '</td><td>' . iconv("utf-8", "windows-1251", $rows[2]) . '</td></tr>';
    }
    $protocol = '<div>&#1055;&#1088;&#1086;&#1090;&#1086;&#1082;&#1086;&#1083;<table  bordercolor="#000000" border="2">' . $text . '</table></div>  ';
    return $protocol;
}

?>
