<?
$s_city='<select id="id_addr_l_city" name="l_city" onchange="list_street($l_city)" title="???????? ?????????? ?????">';
$s_city=$s_city.'<option value="0"> --&#1042;&#1099;&#1073;&#1077;&#1088;&#1080;&#1090;&#1077; &#1075;&#1086;&#1088;&#1086;&#1076; --  </option>';
	include_once("..\..\link\link.php");
		
			 $q_city=mysql_query ('SELECT name, id FROM city_zab where id="'.$_POST['city_zab'].'"  order by kod ');
			 
				while ($r_city = mysql_fetch_row($q_city)) 
					{ if ($r_city[0] == ""){}
						else{
						//echo '<option value="'.$r_incom[1].'"> '.$r_incom[0].'</option>';
								$s_city=$s_city.'<option value="'.$r_city[1].'"> '.$r_city[0].'</option>';
							}
					}
					$s_city=$s_city.'</select>';
					echo $s_city;
					/*$s_city=$_POST['num_in']. ' '.$_POST['date_in'];
					echo $s_city;*/
?>
<script>  $(function(){
        $('#id_addr_l_city').change(function(){
            var val = $(this).val(); //???????? option
            $.ajax({
                type:'post',
                url:'test3.php',//?????????? php
                data :'city_zab='+val,//???????? ???????? option. ?? ??????? ????? ???????? $_POST['value'}

                success:function(result){// ???????? ????? ? ???????
                    $('#res').html(result);//??????? ?? ????????
                }

            })
            console.log($(this).val());
        })
    })
	</script>