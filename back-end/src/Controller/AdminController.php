<?php

namespace App\Controller;
use App\Entity\Period;
use EasyCorp\Bundle\EasyAdminBundle\Controller\EasyAdminController;
use Doctrine\Common\Collections\ArrayCollection;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Contracts\Translation\TranslatorInterface;
use \Datetime;
use App\Entity\Post;
use App\Entity\User;
use Dompdf\Dompdf;
use Dompdf\Options;

use Symfony\Component\HttpFoundation\ResponseHeaderBag;



class AdminController extends EasyAdminController
{

    public function calculateAction(Request $request, $id){

        $em = $this->getDoctrine()->getManager();

        $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
            'id' => $id
        ]);

        $retrievedPosts = $em->getRepository(Post::class)->findBy([
            'period' => $retrievedPeriods->getId(),
        ]);


        $diff = 0;
        $totalTime = new DateTime('00:00:00');
        $totalPrice= 0;
        $totalKm = 0;
        $totalpricekm = 0;

        foreach ($retrievedPosts as $post)
         {
            if($post->getStop()){



                $secs = strtotime($post->getPauze())-strtotime("00:00:00");
                $result = date("H:i:s",strtotime($post->getStart())+$secs);
                // calc time
            
                $stop = new DateTime($post->getStop());
                $start = new DateTime($result);
                /* dd($start); */
                
                $diff = $stop->diff($start);
      
               
                $totalTime->add($diff);
                
                // calc price
                $totalKm += $post->getTransport();
               
                $retrievedUser = $em->getRepository(User::class)->findOneBy([
                    'id' => $post->getUser()
                ]);

                $hours = $diff->h;
                $minutes = $diff->i;
                $seconds = $diff->s;

                if($retrievedUser->getUurtarief() == 0){
                    $hourlyPrice = 30;
                    if($post->getDate()->format('D') == "Sat"){
                        $specialprice = 30 * 0.5;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }else if ($post->getDate()->format('D') == "Sun"){
                        $specialprice = 30 * 2;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }
                    
                
                if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                   $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
                }
                    $uurprijs = $hourlyPrice * $hours;
                    $minutenprijs = $hourlyPrice * ($minutes/60);
                    
                    $totalpricepost = $uurprijs + $minutenprijs;
                    $totalPrice += $totalpricepost;

                    $totalpricekm += $post->getTransport() * 1;
                  
                }else{
                    // prijs uren
                    $hourlyPrice = $retrievedUser->getUurtarief();
                    if($post->getDate()->format('D') == "Sat"){
                        $specialprice = 30 * 0.5;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }else if ($post->getDate()->format('D') == "Sun"){
                        $specialprice = 30 * 2;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }
                    
                
                    if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                    $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
                    }
                    $transportKost = $retrievedUser->getTransportkost();
                    
                    $uurprijs = $hourlyPrice * $hours;
                    $minutenprijs = $hourlyPrice * ($minutes/60);
                    
                    $totalpricepost = $uurprijs + $minutenprijs;
                    $totalPrice += $totalpricepost;

                    // prijs km
                    $totalpricekm += $post->getTransport() * $transportKost;

                }
             } 
         } 

        return $this->render('backend/calculate.html.twig', [
            'period' => $retrievedPeriods,
            'posts' => $retrievedPosts,
            'period' => $retrievedPeriods,
            'timeworked' => $totalTime,
            'totalprice' => $totalPrice,
            'totalKm' => $totalKm,
            'totalpricekm' => $totalpricekm,
            'priceToPay' => $totalPrice + $totalpricekm
        ]);

    }
    public function pdfAction($id)
    {
         // Configure Dompdf according to your needs
         $pdfOptions = new Options();
         $pdfOptions->set('defaultFont', 'Open Sans');
         
         // Instantiate Dompdf with our options
         $dompdf = new Dompdf($pdfOptions);
         
         $em = $this->getDoctrine()->getManager();
         
         $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
             'id' => $id
         ]);
 
         $retrievedPosts = $em->getRepository(Post::class)->findBy([
             'period' => $retrievedPeriods->getId(),
         ]);

         $diff = 0;
         $totalTime = new DateTime('00:00:00');
         $totalPrice= 0;
         $totalKm = 0;
         $totalpricekm = 0;
         // calc all information needed
         foreach ($retrievedPosts as $post)
         {
            if($post->getStop()){



                $secs = strtotime($post->getPauze())-strtotime("00:00:00");
                $result = date("H:i:s",strtotime($post->getStart())+$secs);
                // calc time
            
                $stop = new DateTime($post->getStop());
                $start = new DateTime($result);
                /* dd($start); */
                
                $diff = $stop->diff($start);
      
               
                $totalTime->add($diff);
                
                // calc price
                $totalKm += $post->getTransport();
               
                $retrievedUser = $em->getRepository(User::class)->findOneBy([
                    'id' => $post->getUser()
                ]);

                $hours = $diff->h;
                $minutes = $diff->i;
                $seconds = $diff->s;

                if($retrievedUser->getUurtarief() == 0){
                    $hourlyPrice = 30;
                    if($post->getDate()->format('D') == "Sat"){
                        $specialprice = 30 * 0.5;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }else if ($post->getDate()->format('D') == "Sun"){
                        $specialprice = 30 * 2;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }
                    
                
                if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                   $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
                }
                    $uurprijs = $hourlyPrice * $hours;
                    $minutenprijs = $hourlyPrice * ($minutes/60);
                    
                    $totalpricepost = $uurprijs + $minutenprijs;
                    $totalPrice += $totalpricepost;

                    $totalpricekm += $post->getTransport() * 1;
                  
                }else{
                    // prijs uren
                    $hourlyPrice = $retrievedUser->getUurtarief();
                    if($post->getDate()->format('D') == "Sat"){
                        $specialprice = 30 * 0.5;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }else if ($post->getDate()->format('D') == "Sun"){
                        $specialprice = 30 * 2;
                        $hourlyPrice = $hourlyPrice + $specialprice;
                    }
                    
                
                    if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                    $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
                    }
                    $transportKost = $retrievedUser->getTransportkost();
                    
                    $uurprijs = $hourlyPrice * $hours;
                    $minutenprijs = $hourlyPrice * ($minutes/60);
                    
                    $totalpricepost = $uurprijs + $minutenprijs;
                    $totalPrice += $totalpricepost;

                    // prijs km
                    $totalpricekm += $post->getTransport() * $transportKost;

                }
             } 
         } 
          // Retrieve the HTML generated in our twig file
          $html = $this->renderView('pdf/period.html.twig', [
           'period' => $retrievedPeriods,
            'customer' => $retrievedPeriods->getCustomer(),
            'posts' => $retrievedPosts,
            'timeworked' => $totalTime,
            'totalprice' => $totalPrice,
            'totalKm' => $totalKm,
            'totalpricekm' => $totalpricekm,
            'priceToPay' => $totalPrice + $totalpricekm 
        ]);
      
        $html .= ' <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">';

        // Load HTML to Dompdf
        $dompdf->loadHtml($html);
        
        // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser (inline view)
        $dompdf->stream("period.pdf", [
            "Attachment" => true
        ]);
       
        dd($dompdf); 

        $this->addFlash('success', 'Pdf gedownload');
        return $this->render('backend/calculate.html.twig', [
            'id' => $id,
        ]);

     /*    return $this->redirectToRoute('calculate',array('id' => $id));  */
        
         /* return $this->redirectToRoute('detail',array('id' => $id)); */
    }
    public function mailAction($id){

        $em = $this->getDoctrine()->getManager();
        $transport = (new \Swift_SmtpTransport('smtp.mailtrap.io', 2525))
        ->setUsername('229407a203eb8a')
        ->setPassword('07ff2fdaec1e9c')
        ;
        $mailer = new \Swift_Mailer($transport);
        $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
            'id' => $id
        ]);

        $customer = $retrievedPeriods->getCustomer();
        
        $message = (new \Swift_Message('Nieuwe periode aangemaakt | Arte-tech'))
        // Add subject
        ->setSubject('Nieuwe periode aangemaakt | Arte-tech')

        //Put the From address 
        ->setFrom(['support@example.com'])

        // Include several To addresses
        ->setTo([$customer->getEmail()])
        ->setBody(
            $this->renderView(
                'emails/period.html.twig',
                [
                     'customer' => $retrievedPeriods->getCustomer(),
                     
                 ]
            ), 'text/html'
            );

        $result = $mailer->send($message);

        $this->addFlash('success', 'Mail verzonden');
      
        return $this->redirectToRoute('calculate',array('id' => $id));
    }
    
    public function excelAction(Request $request,$id){

        $em = $this->getDoctrine()->getManager();
        $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
            'id' => $id
        ]);

        $retrievedPosts = $em->getRepository(Post::class)->findBy([
            'period' => $retrievedPeriods->getId(),
        ]);

        $customer = $retrievedPeriods->getCustomer();
        
        $diff = 0;
        $totalTime = new DateTime('00:00:00');
        $totalPrice = 0;
        $totalKm = 0;
        $totalpricekm = 0;
        // calc all information needed
        foreach ($retrievedPosts as $post)
        {
           if($post->getStop()){



               $secs = strtotime($post->getPauze())-strtotime("00:00:00");
               $result = date("H:i:s",strtotime($post->getStart())+$secs);
               // calc time
           
               $stop = new DateTime($post->getStop());
               $start = new DateTime($result);
               /* dd($start); */
               
               $diff = $stop->diff($start);
     
              
               $totalTime->add($diff);
               
               // calc price
               $totalKm += $post->getTransport();
              
               $retrievedUser = $em->getRepository(User::class)->findOneBy([
                   'id' => $post->getUser()
               ]);

               $hours = $diff->h;
               $minutes = $diff->i;
               $seconds = $diff->s;

               if($retrievedUser->getUurtarief() == 0){
                   $hourlyPrice = 30;
                   if($post->getDate()->format('D') == "Sat"){
                       $specialprice = 30 * 0.5;
                       $hourlyPrice = $hourlyPrice + $specialprice;
                   }else if ($post->getDate()->format('D') == "Sun"){
                       $specialprice = 30 * 2;
                       $hourlyPrice = $hourlyPrice + $specialprice;
                   }
                   
               
               if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                  $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
               }
                   $uurprijs = $hourlyPrice * $hours;
                   $minutenprijs = $hourlyPrice * ($minutes/60);
                   
                   $totalpricepost = $uurprijs + $minutenprijs;
                   $totalPrice += $totalpricepost;

                   $totalpricekm += $post->getTransport() * 1;
                 
               }else{
                   // prijs uren
                   $hourlyPrice = $retrievedUser->getUurtarief();
                   if($post->getDate()->format('D') == "Sat"){
                       $specialprice = 30 * 0.5;
                       $hourlyPrice = $hourlyPrice + $specialprice;
                   }else if ($post->getDate()->format('D') == "Sun"){
                       $specialprice = 30 * 2;
                       $hourlyPrice = $hourlyPrice + $specialprice;
                   }
                   
               
                   if($hours > 8 || ($hours == 8 && $minutes >= 1) && $post->getDate()->format('D') !== "Sat" && $post->getDate()->format('D') !== "Sun"){
                   $hourlyPrice = $hourlyPrice + ($hourlyPrice*0.2);
                   }
                   $transportKost = $retrievedUser->getTransportkost();
                   
                   $uurprijs = $hourlyPrice * $hours;
                   $minutenprijs = $hourlyPrice * ($minutes/60);
                   
                   $totalpricepost = $uurprijs + $minutenprijs;
                   $totalPrice += $totalpricepost;

                   // prijs km
                   $totalpricekm += $post->getTransport() * $transportKost;

               }
            } 
        } 
            $spreadsheet = new Spreadsheet();
            
            /* @var $sheet \PhpOffice\PhpSpreadsheet\Writer\Xlsx\Worksheet */
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setCellValue('A1', 'Periode Informatie');
            $sheet->setCellValue('A2', 'Periode:');
            $sheet->setCellValue('B2', $retrievedPeriods->getTitle());
            $sheet->setCellValue('A3', 'Bedrijf');
            $sheet->setCellValue('A4', 'Naam:');
            $sheet->setCellValue('B4', 'Arte-tech');
            $sheet->setCellValue('A5', 'Adres:');
            $sheet->setCellValue('B5', 'Willekeurig adres');
            $sheet->setCellValue('A6', 'Telefoon:');
            $sheet->setCellValue('B6', 'Willekeurig telefoon nummer');
            $sheet->setCellValue('A7', 'Klant');
            $sheet->setCellValue('A8', 'Naam');
            $sheet->setCellValue('B8', $customer->getName());
            $sheet->setCellValue('A9', 'Adres');
            $sheet->setCellValue('B9',  $customer->getAdress());
            $sheet->setCellValue('A10','Telefoon');
            $sheet->setCellValue('B10', $customer->getPhone());
            $sheet->setCellValue('A10','Prijs');
            $sheet->setCellValue('B10', $totalPrice);
            $sheet->setCellValue('A10','Uren');
            $sheet->setCellValue('B10', 'Uren');
            $sheet->setTitle("My First Worksheet");
            
            // Create your Office 2007 Excel (XLSX Format)
            $writer = new Xlsx($spreadsheet);
            
            // Create a Temporary file in the system
            $fileName = $retrievedPeriods->getTitle() . '.xlsx';
            $temp_file = tempnam(sys_get_temp_dir(), $fileName);
            
            // Create the excel file in the tmp directory of the system
            $writer->save($temp_file);
            /* $this->addFlash('success', 'Excel file gedownload'); */
            // Return the excel file as an attachment
            return $this->file($temp_file, $fileName, ResponseHeaderBag::DISPOSITION_INLINE);
        }
    
}