<?
$date_cr=date_create($_POST['date_rasp']);
$year=$date_cr->format('Y');
$basis=$_POST['basis_rasp'];
$date_start=$_POST['data_start'];
$date_stop=$_POST['date_stop'];
$id_u=$_COOKIE['userid'];
include_once("..\link\link.php");
$text='SELECT  `id_order` ,  `id` FROM  `act` WHERE  `act_year` =2019 AND  `address_id` =0 AND  `obj_id` =0';

$q1=mysql_query ($text);
while ($r1 = mysql_fetch_row($q1)) 
{
echo '<p>&#1042;&#1099;&#1073;&#1077;&#1088;&#1072;&#1077;&#1084; &#1072;&#1082;&#1090; &#1089; &#1087;&#1091;&#1089;&#1090;&#1099;&#1084;&#1080; &#1089;&#1074;&#1103;&#1079;&#1103;&#1084;&#1080;'.$r1[1].'</p>';
$text2="SELECT   `link_order_obj`.`id_obj_c` ,  `link_order_address`.`id_address` 
FROM link_order_obj
LEFT JOIN  `housing_supervision1`.`link_order_address` ON  `link_order_obj`.`id` =  `link_order_address`.`id_link_order_obj` 
WHERE (`link_order_obj`.`id_obj_c` is not null) and  (`link_order_address`.`id_address` is not null) and   `link_order_obj`.`id_order`  =".$r1[0];
echo '<p>'.$text2.'</p>';
$q2=mysql_query ($text2);
//while (
$r2 = mysql_fetch_row($q2);
//) 
//{
//if($r2[0]=="" or $r2[1]==""){}else{
echo '<p>&#1053;&#1072;&#1093;&#1086;&#1076;&#1080;&#1084; &#1089;&#1074;&#1103;&#1079;&#1080; &#1087;&#1086; &#1086;&#1073;&#1088;&#1072;&#1097;&#1077;&#1085;&#1080;&#1102; &#1080; &#1079;&#1072;&#1085;&#1086;&#1089;&#1080;&#1084; &#1076;&#1072;&#1085;&#1085;&#1099;&#1077; &#1074; &#1072;&#1082;&#1090; '.$r2[0].$r2[1].'</p>';
	update_size( $r1[1],$r2[0],$r2[1]);
	//}
//}				
}



function update_size( $id, $o,$a){
echo '<p> UPDATE `act` SET `address_id`="'.$a.'",`obj_id`="'.$o.'"
WHERE `id`="'.$id.'"</p>';
$insert_tab=mysql_query ('UPDATE `act` SET `address_id`="'.$a.'",`obj_id`="'.$o.'" WHERE `id`="'.$id.'"');
					
				
	
}
 

?>