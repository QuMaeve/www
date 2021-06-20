<?php
include_once("..\link\link.php");
$id_doc = $_POST['id_doc'];
//echo $del_w;

//if ($id_doc == "0") {
//    echo 'error';
//} else {
//    if ($id_doc == "") {
//        echo 'error';
//    } else {
//        $where = "where id_doc='" . $id_doc . "'";
//    }
//}
$q = "select id, name_pole from pole_doc where id_doc=" . $id_doc . " order by name_pole";
$r = mysql_query($q);
//echo $q;
while ($myrow = mysql_fetch_row($r)) {
    if ($myrow[0] == "") {
    } else {

        echo '<div>'. iconv("utf-8", "windows-1251", $myrow[1]) . '</div><input type="text" id="' . $myrow[0] . '"/>';

    }
}
?>
