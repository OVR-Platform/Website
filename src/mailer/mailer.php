<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

if ( $_POST["name"] == "" || $_POST["email"] == "" || $_POST["msg"] == ""){
  echo 'false';
  return false;
}

$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
try {

    //Server settings
    $mail->IsSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->SMTPDebug = 2;                                 // Enable verbose debug output
    $mail->Host = 'mail.ovr.ai';                // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'admin@ovr.ai';                 // SMTP username
    $mail->Password = 'emaOVV1818!!!';                           // SMTP password
    $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('admin@ovr.ai', 'OVR - Contatto dal sito web');
    // $mail->addAddress('school@elifriulia.it', 'Elifriulia School');     // Add a recipient
    // $mail->addAddress('federica.dalcin@elifriulia.it', 'Federica Elifriulia');     // Add a recipient
    // $mail->addReplyTo('eventi@elifriulia.it', 'No Reply');
    // $mail->AddBCC('dalciosan@gmail.com', 'Dalcio');
    $mail->addAddress('info@ovr.ai', 'OVR');     // Add a recipient


    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Nuovo contatto dal sito Web';
    $mail->Body    = 'Nuovo contatto da "'.$_POST["name"].'" <br> Email: "'.$_POST["email"].'"<br> Messaggio: "'.$_POST["msg"].'" <br>' ;
    $mail->AltBody = 'Nuovo contatto da "'.$_POST["name"].'"  Email: "'.$_POST["email"].'"  Messaggio: "'.$_POST["msg"].'" ' ;

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}
