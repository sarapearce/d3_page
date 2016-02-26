
<?php

class Template {
    public function loadSmartyAction() {
	require_once('libs/Smarty.class.php');
	$smarty = new Smarty();
    }

    public function compileTemplates() {
	// force compilation of all template files
	$smarty->compileAllTemplates('.tpl', true);
    }

    public function loadTemplate() {
	$smarty->caching = true;

	if (!$smarty->is_cached('index.tpl')) {

	    // dummy up some data
	    $address = '245 N 50th';
	    $db_data = array(
		'City' => 'Lincoln',
		'State' => 'Nebraska',
		'Zip' => '68502'
	    );

	    $smarty->assign('Name', 'Fred');
	    $smarty->assign('Address', $address);
	    $smarty->assign('data', $db_data);
	}

	// display the output
	$smarty->display('index.tpl');
    }

}
?>

