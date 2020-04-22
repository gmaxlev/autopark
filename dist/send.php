<?php

    /* 
        Список адресов
    */
    $recipients = array(
        "gmaxlev@gmail.com"
    );


    if (!isset($_POST['form'])) exit;

    $text_message ='';
  
    $form_formname = htmlspecialchars(trim($_POST['form']));
    $form_name = htmlspecialchars(trim($_POST['name']));
    $form_phone = htmlspecialchars(trim($_POST['phone']));

    $text_message = "
        Форма: ".$form_formname ." <br>
        Имя: ".$form_name ." <br>
        Номер телефона: ".$form_phone." <br>
    ";
    
    
    $mail['charset'] = "utf-8";
    $mail['to'] = implode(',', $recipients);
    $mail['subject'] = 'Новый клиент';
    $mail['massage'] = $text_message;
    
    $mail['header'] = "MIME-Version: 1.0\n"
    ."X-Priority: 3\n"
    ."X-Mailer: Mailer\n"
    ."Content-Transfer-Encoding: 8bit\n"
    ."Content-Type: text/html; charset=" . $mail['charset'] . "\n";
    
    mail ($mail['to'], $mail['subject'], $mail['massage'], $mail['header']);
    

?>