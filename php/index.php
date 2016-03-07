
<?php

class Template {
    
    public function connectDb() {
	$config = include('config.php');
    }

    public function loadSmartyAction() {
	require_once('libs/Smarty.class.php');
	$this->smarty = new Smarty();
    }
 
    public function compileTemplates() {
	// force compilation of all template files
	$this->smarty->compileAllTemplates('.tpl', true);
    }

    public function displayIndexTemplate() {
	// display the output
	$this->smarty->display('index.tpl');
    }

}


?>

