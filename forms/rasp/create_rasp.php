<style type="text/css">
<!--
.?????1 {font-size: xx-large}
-->
</style>
<div align="center"><strong>&#1057;&#1086;&#1079;&#1076;&#1072;&#1085;&#1080;&#1077; &#1085;&#1086;&#1074;&#1086;&#1075;&#1086; &#1088;&#1072;&#1089;&#1087;&#1086;&#1088;&#1103;&#1078;&#1077;&#1085;&#1080;&#1103; </strong></div><form id="obr_form_create" name="obr_form_create" enctype="multipart/form-data"  method="post">
<!--<input  type="date" name="find_date_in_begin"    />-->

<table width="100%" border="0">
  <tr>
    <td align="left"  border="1">
      <p align="left">&#1054;&#1089;&#1085;&#1086;&#1074;&#1072;&#1085;&#1080;&#1077; &#1076;&#1083;&#1103;  &#1088;&#1072;&#1089;&#1087;&#1086;&#1088;&#1103;&#1078;&#1077;&#1085;&#1080;&#1103; </p>
      
    
      <p align="left"><span class="td_style_2">
        <select name="find_basis_rasp" id="find_basis_rasp" onchange="plaseRasp()">    
          <option value="0"></option>
          <option value="1">&#1054;&#1073;&#1088;&#1072;&#1097;&#1077;&#1085;&#1080;&#1103;</option>
          <option value="2">&#1055;&#1083;&#1072;&#1085;&#1086;&#1074;&#1072;&#1103; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1072;</option>
          <option value="3">&#1055;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1072; &#1087;&#1088;&#1077;&#1076;&#1087;&#1080;&#1089;&#1072;&#1085;&#1080;&#1081;</option>
          <option value="4">&#1055;&#1086; &#1090;&#1088;&#1077;&#1073;&#1086;&#1074;&#1072;&#1085;&#1080;&#1102; &#1087;&#1088;&#1086;&#1082;&#1091;&#1088;&#1072;&#1090;&#1091;&#1088;&#1099;</option>
		  <option value="5">&#1052;&#1086;&#1090;&#1080;&#1074;&#1080;&#1088;&#1086;&#1074;&#1072;&#1085;&#1085;&#1086;&#1077; &#1087;&#1088;&#1077;&#1076;&#1089;&#1090;&#1072;&#1074;&#1083;&#1077;&#1085;&#1080;&#1077;</option>
        </select>
      </span></p>
	  <p>&#1044;&#1072;&#1090;&#1072; &#1088;&#1072;&#1089;&#1087;&#1086;&#1088;&#1103;&#1078;&#1077;&#1085;&#1080;&#1103; 
        <input type="date" name="date_rasp" id="date_rasp"  value="<? $d=date_create();
		echo $d->format('Y-m-d');
		?>"/> </p>
     
        <div id="choice" name="choice" method="post" align="left" style="display:none" >
          <p id="name_choice" align="left"> </p>
		  <select name="choice_list" id="choice_list" onchange="load_data()">
          </select>
          <select name="period" id="period" onchange="choice_list_create()" >
          </select>
		  <select name="user_choice" id="user_choice" onchange="choice_list_create()"  >
          </select>
        </div> 
		<label style="display:none">
		<input type="checkbox" name="expert" id="expert"   />&#1055;&#1088;&#1080;&#1074;&#1083;&#1077;&#1095;&#1100; &#1082; &#1087;&#1088;&#1086;&#1074;&#1077;&#1076;&#1077;&#1085;&#1080;&#1102; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080; &#1074; &#1082;&#1072;&#1095;&#1077;&#1089;&#1090;&#1074;&#1077;  &#1101;&#1082;&#1089;&#1087;&#1077;&#1088;&#1090;&#1086;&#1074;, &#1087;&#1088;&#1077;&#1076;&#1089;&#1090;&#1072;&#1074;&#1080;&#1090;&#1077;&#1083;&#1077;&#1081; &#1101;&#1082;&#1089;&#1087;&#1077;&#1088;&#1090;&#1085;&#1099;&#1093; &#1086;&#1088;&#1075;&#1072;&#1085;&#1080;&#1079;&#1072;&#1094;&#1080;&#1081;</label>
		
		<div id="expert_data"  ></div>
		<p>&#1059;&#1082;&#1072;&#1078;&#1080;&#1090;&#1077; &#1076;&#1072;&#1090;&#1091; &#1085;&#1072;&#1095;&#1072;&#1083;&#1072; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080; </p>
		<p>
		  <input type="date" name="date_start" id="date_start"  onchange="period_fun()"/>
		</p>
		<p id="date_end_period"></p>
		
		
  </td>
  	<td align="left"  width="30%">
  	
  	  <p align="left" id="test">
  	    <?php

		/*	include_once('query_form\query_in.php');	
	list_incoming($op);
	
	echo $op;*/
	
		?>
  	  </p></td>
  </tr>
</table>
  
  
  
    <tr>
          <td width="33%">
		  <div id="obr_form" name="obr_form" enctype="multipart/form-data"  method="post">
  		    </div>
	
          <div name="rasp_place" id="rasp_place"></div>
	     <!--!--> 
  <div    style="display:none"   id="procuror" >
 <label ><input type="checkbox" name="add_approval_rasp" id="add_approval_rasp"  onclick="treb_procuror()"/>
&#1057;&#1086;&#1075;&#1083;&#1072;&#1089;&#1086;&#1074;&#1072;&#1085;&#1080;&#1077; &#1087;&#1088;&#1086;&#1082;&#1091;&#1088;&#1072;&#1090;&#1091;&#1088;&#1099;	

</label><!--!-->
<div style="display:none" id="div_procuror" ><p>&#1053;&#1086;&#1084;&#1077;&#1088; &#1089;&#1086;&#1075;&#1083;&#1072;&#1089;&#1086;&#1074;&#1072;&#1085;&#1080;&#1103; 
  <input type="text" name="num_approval" id="num_approval" />
</p>
<p><label><input type="checkbox" checked="checked"  name="val_approval" id="val_approval" onclick="procuror_approval()"/>&#1057;&#1086;&#1075;&#1083;&#1072;&#1089;&#1086;&#1074;&#1072;&#1085;&#1085;&#1086; 
	</label>	    
</p>
<div id="div_p_a" style=" display:none">
<text height="20" width="50"></text>
<input align="top" height="20" width="50" type="text" disabled id="otkaz" /><input type="hidden" id="otkaz_id"><img id="but_select" border="1"  align="top" width="19" height="19" src="img/select.png" onclick="choice_sel_click()">


  
<div id="otkaz_basis" style=" display:none; background:#FFFFFF; height:200; overflow:auto; width:400; font:x-small">
 <p onmouseout="big_sel_out('op_sel1')" onmouseover="big_sel_focus('op_sel1')" onclick="big_sel_choice('op_sel1')" id="op_sel1">&#1086;&#1090;&#1089;&#1091;&#1090;&#1089;&#1090;&#1074;&#1080;&#1077;    &#1076;&#1086;&#1082;&#1091;&#1084;&#1077;&#1085;&#1090;&#1086;&#1074;, &#1087;&#1088;&#1080;&#1083;&#1072;&#1075;&#1072;&#1077;&#1084;&#1099;&#1093; &#1082; &#1079;&#1072;&#1103;&#1074;&#1083;&#1077;&#1085;&#1080;&#1102; &#1086; &#1089;&#1086;&#1075;&#1083;&#1072;&#1089;&#1086;&#1074;&#1072;&#1085;&#1080;&#1080; &#1087;&#1088;&#1086;&#1074;&#1077;&#1076;&#1077;&#1085;&#1080;&#1103; &#1074;&#1085;&#1077;&#1087;&#1083;&#1072;&#1085;&#1086;&#1074;&#1086;&#1081;    &#1074;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080;</p>
  <hr />
  
    <p onmouseout="big_sel_out('op_sel2')" onmouseover="big_sel_focus('op_sel2')" onclick="big_sel_choice('op_sel2')" id="op_sel2">&#1086;&#1090;&#1089;&#1091;&#1090;&#1089;&#1090;&#1074;&#1080;&#1077; &#1086;&#1089;&#1085;&#1086;&#1074;&#1072;&#1085;&#1080;&#1081; &#1076;&#1083;&#1103; &#1087;&#1088;&#1086;&#1074;&#1077;&#1076;&#1077;&#1085;&#1080;&#1103; &#1074;&#1085;&#1077;&#1087;&#1083;&#1072;&#1085;&#1086;&#1074;&#1086;&#1081; &#1074;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081;    &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080;</p>
  <hr />
  
    <p onmouseout="big_sel_out('op_sel3')" onmouseover="big_sel_focus('op_sel3')" onclick="big_sel_choice('op_sel3')" id="op_sel3">&#1085;&#1077;&#1089;&#1086;&#1073;&#1083;&#1102;&#1076;&#1077;&#1085;&#1080;&#1077; &#1090;&#1088;&#1077;&#1073;&#1086;&#1074;&#1072;&#1085;&#1080;&#1081; &#1082; &#1086;&#1092;&#1086;&#1088;&#1084;&#1083;&#1077;&#1085;&#1080;&#1102; &#1088;&#1077;&#1096;&#1077;&#1085;&#1080;&#1103; &#1086;&#1088;&#1075;&#1072;&#1085;&#1072;    &#1075;&#1086;&#1089;&#1091;&#1076;&#1072;&#1088;&#1089;&#1090;&#1074;&#1077;&#1085;&#1085;&#1086;&#1075;&#1086; &#1082;&#1086;&#1085;&#1090;&#1088;&#1086;&#1083;&#1103; (&#1085;&#1072;&#1076;&#1079;&#1086;&#1088;&#1072;), &#1086;&#1088;&#1075;&#1072;&#1085;&#1072; &#1084;&#1091;&#1085;&#1080;&#1094;&#1080;&#1087;&#1072;&#1083;&#1100;&#1085;&#1086;&#1075;&#1086; &#1082;&#1086;&#1085;&#1090;&#1088;&#1086;&#1083;&#1103; &#1086;    &#1087;&#1088;&#1086;&#1074;&#1077;&#1076;&#1077;&#1085;&#1080;&#1080; &#1074;&#1085;&#1077;&#1087;&#1083;&#1072;&#1085;&#1086;&#1074;&#1086;&#1081; &#1074;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080;</p>
  
  <hr />
    <p onmouseout="big_sel_out('op_sel4')" onmouseover="big_sel_focus('op_sel4')" onclick="big_sel_choice('op_sel4')" id="op_sel4">&#1086;&#1089;&#1091;&#1097;&#1077;&#1089;&#1090;&#1074;&#1083;&#1077;&#1085;&#1080;&#1077; &#1087;&#1088;&#1086;&#1074;&#1077;&#1076;&#1077;&#1085;&#1080;&#1103; &#1074;&#1085;&#1077;&#1087;&#1083;&#1072;&#1085;&#1086;&#1074;&#1086;&#1081; &#1074;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080;,    &#1087;&#1088;&#1086;&#1090;&#1080;&#1074;&#1086;&#1088;&#1077;&#1095;&#1072;&#1097;&#1077;&#1081; &#1092;&#1077;&#1076;&#1077;&#1088;&#1072;&#1083;&#1100;&#1085;&#1099;&#1084; &#1079;&#1072;&#1082;&#1086;&#1085;&#1072;&#1084;, &#1085;&#1086;&#1088;&#1084;&#1072;&#1090;&#1080;&#1074;&#1085;&#1099;&#1084; &#1087;&#1088;&#1072;&#1074;&#1086;&#1074;&#1099;&#1084; &#1072;&#1082;&#1090;&#1072;&#1084; &#1055;&#1088;&#1077;&#1079;&#1080;&#1076;&#1077;&#1085;&#1090;&#1072;    &#1056;&#1086;&#1089;&#1089;&#1080;&#1081;&#1089;&#1082;&#1086;&#1081; &#1060;&#1077;&#1076;&#1077;&#1088;&#1072;&#1094;&#1080;&#1080; &#1080; &#1055;&#1088;&#1072;&#1074;&#1080;&#1090;&#1077;&#1083;&#1100;&#1089;&#1090;&#1074;&#1072; &#1056;&#1086;&#1089;&#1089;&#1080;&#1081;&#1089;&#1082;&#1086;&#1081; &#1060;&#1077;&#1076;&#1077;&#1088;&#1072;&#1094;&#1080;&#1080;</p>
  
  <hr />
    <p onmouseout="big_sel_out('op_sel5')" onmouseover="big_sel_focus('op_sel5')" onclick="big_sel_choice('op_sel5')" id="op_sel5">&#1085;&#1077;&#1089;&#1086;&#1086;&#1090;&#1074;&#1077;&#1090;&#1089;&#1090;&#1074;&#1080;&#1077; &#1087;&#1088;&#1077;&#1076;&#1084;&#1077;&#1090;&#1072; &#1074;&#1085;&#1077;&#1087;&#1083;&#1072;&#1085;&#1086;&#1074;&#1086;&#1081; &#1074;&#1099;&#1077;&#1079;&#1076;&#1085;&#1086;&#1081; &#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1080;    &#1087;&#1086;&#1083;&#1085;&#1086;&#1084;&#1086;&#1095;&#1080;&#1103;&#1084; &#1086;&#1088;&#1075;&#1072;&#1085;&#1072; &#1075;&#1086;&#1089;&#1091;&#1076;&#1072;&#1088;&#1089;&#1090;&#1074;&#1077;&#1085;&#1085;&#1086;&#1075;&#1086; &#1082;&#1086;&#1085;&#1090;&#1088;&#1086;&#1083;&#1103; (&#1085;&#1072;&#1076;&#1079;&#1086;&#1088;&#1072;) &#1080;&#1083;&#1080; &#1086;&#1088;&#1075;&#1072;&#1085;&#1072;    &#1084;&#1091;&#1085;&#1080;&#1094;&#1080;&#1087;&#1072;&#1083;&#1100;&#1085;&#1086;&#1075;&#1086; &#1082;&#1086;&#1085;&#1090;&#1088;&#1086;&#1083;&#1103;</p>
  
  <hr />
    <p onmouseout="big_sel_out('op_sel6')" onmouseover="big_sel_focus('op_sel6')" onclick="big_sel_choice('op_sel6')" id="op_sel6">&#1087;&#1088;&#1086;&#1074;&#1077;&#1088;&#1082;&#1072; &#1089;&#1086;&#1073;&#1083;&#1102;&#1076;&#1077;&#1085;&#1080;&#1103; &#1086;&#1076;&#1085;&#1080;&#1093; &#1080; &#1090;&#1077;&#1093; &#1078;&#1077; &#1086;&#1073;&#1103;&#1079;&#1072;&#1090;&#1077;&#1083;&#1100;&#1085;&#1099;&#1093; &#1090;&#1088;&#1077;&#1073;&#1086;&#1074;&#1072;&#1085;&#1080;&#1081; &#1080;    &#1090;&#1088;&#1077;&#1073;&#1086;&#1074;&#1072;&#1085;&#1080;&#1081;, &#1091;&#1089;&#1090;&#1072;&#1085;&#1086;&#1074;&#1083;&#1077;&#1085;&#1085;&#1099;&#1093; &#1084;&#1091;&#1085;&#1080;&#1094;&#1080;&#1087;&#1072;&#1083;&#1100;&#1085;&#1099;&#1084;&#1080; &#1087;&#1088;&#1072;&#1074;&#1086;&#1074;&#1099;&#1084;&#1080; &#1072;&#1082;&#1090;&#1072;&#1084;&#1080;, &#1074; &#1086;&#1090;&#1085;&#1086;&#1096;&#1077;&#1085;&#1080;&#1080; &#1086;&#1076;&#1085;&#1086;&#1075;&#1086;    &#1102;&#1088;&#1080;&#1076;&#1080;&#1095;&#1077;&#1089;&#1082;&#1086;&#1075;&#1086; &#1083;&#1080;&#1094;&#1072; &#1080;&#1083;&#1080; &#1086;&#1076;&#1085;&#1086;&#1075;&#1086; &#1080;&#1085;&#1076;&#1080;&#1074;&#1080;&#1076;&#1091;&#1072;&#1083;&#1100;&#1085;&#1086;&#1075;&#1086; &#1087;&#1088;&#1077;&#1076;&#1087;&#1088;&#1080;&#1085;&#1080;&#1084;&#1072;&#1090;&#1077;&#1083;&#1103; &#1085;&#1077;&#1089;&#1082;&#1086;&#1083;&#1100;&#1082;&#1080;&#1084;&#1080;    &#1086;&#1088;&#1075;&#1072;&#1085;&#1072;&#1084;&#1080; &#1075;&#1086;&#1089;&#1091;&#1076;&#1072;&#1088;&#1089;&#1090;&#1074;&#1077;&#1085;&#1085;&#1086;&#1075;&#1086; &#1082;&#1086;&#1085;&#1090;&#1088;&#1086;&#1083;&#1103; (&#1085;&#1072;&#1076;&#1079;&#1086;&#1088;&#1072;)</p>
</div>
 </div>
  </div>
	</div>	
		
		<div align="left" class="&#1089;&#1090;&#1080;&#1083;&#1100;1">
  <input  type="button" name="obr_b_c" value="&#1057;&#1086;&#1079;&#1076;&#1072;&#1090;&#1100;"  align="center" onclick="create_rasp()" />
  
  <input  type="button" name="obr_b_c2" value="&#1054;&#1090;&#1084;&#1077;&#1085;&#1072;" url='index.php' />

</div>

</form></td>


  
	

	
  