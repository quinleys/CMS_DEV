<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Period;
use App\Entity\Post;
use App\Entity\User;
use \Datetime;
use App\Entity\Complaint;
use App\Form\ComplaintType;
use Symfony\Component\HttpFoundation\Request;
use Dompdf\Dompdf;
use Dompdf\Options;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

    /**
     * @Route("/client", name="client")
     * 
     * @IsGranted("ROLE_CLIENT")
     */
class ClientController extends AbstractController
{
      /**
     * @Route("/client/periods",name="periods")
     * 
     * @IsGranted("ROLE_CLIENT")
     */
    public function periods() 
    {
        // Deny unless CLIENT
        $this->denyAccessUnlessGranted('ROLE_CLIENT', null, 'User tried to access a page without having ROLE_CLIENT');
        
        $em = $this->getDoctrine()->getManager();
        
        // GET logged in user
        $user = $this->get('security.token_storage')->getToken()->getUser();
        
        // GET periodes
        $retrievedPeriods = $em->getRepository(Period::class)->findBy([
            'customer' => $user->getCustomer()
        ]);

        return $this->render('client/periods.html.twig', [
            'periods' => $retrievedPeriods,
            'user' => $user
        ]);
    }


        /**
     * @Route("/client/periods/{id}/complaint",name="complaint")
     * 
     * @IsGranted("ROLE_CLIENT")
     */
    public function complaint(Request $request, $id)
    {
        $complaint = new Complaint();
        $em = $this->getDoctrine()->getManager();
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $retrievedPeriod = $em->getRepository(Period::class)->findOneBy([
            'customer' => $user->getCustomer(),
            'id' => $id
        ]);
      
        $complaint->setIsFixed(false);
        $complaint->setCustomer($user->getCustomer());
        $complaint->setPeriod($retrievedPeriod);

        $form = $this->createForm(ComplaintType::class , $complaint, [
            'action' => $this->generateUrl("complaint", array('id' => $id), true)
        ]);

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid())
        {
            
           
            $em->persist($complaint);
            $em->flush();
            $this->addFlash('success', 'Klacht ontvangen! Onze excuses, wij lossen het probleem zo snel mogelijk op!');
            return $this->redirectToRoute('detail',array('id' => $id));
        }
        return $this->render('client/complaint.html.twig',[
            'complaint_form' => $form->createView()
        ]);
    }
    /**
     * @Route("/client",name="home")
     * 
     * @IsGranted("ROLE_CLIENT")
     */
    public function client()
    {
        $this->denyAccessUnlessGranted('ROLE_CLIENT', null, 'User tried to access a page without having ROLE_ADMIN');
        
        $em = $this->getDoctrine()->getManager();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        
        $retrievedPeriods = $em->getRepository(Period::class)->findBy([
            'customer' => $user->getCustomer()
        ]);

        $username = $this->getUser()->getUsername();


        return $this->render('client/home.html.twig', [
            'periods' => $retrievedPeriods,
            'user' => $user
        ]);
    }
    /**
     * @Route("/client/periods/{id}",name="detail")
     * 
     * @IsGranted("ROLE_CLIENT")
     */
    public function show($id)
    {
        $em = $this->getDoctrine()->getManager();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        
        $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
            'customer' => $user->getCustomer(),
            'id' => $id
        ]);

        $retrievedPosts = $em->getRepository(Post::class)->findBy([
            'customer' => $user->getCustomer(),
            'period' => $retrievedPeriods->getId(),
        ]);
        $retrievedComplaints = $em->getRepository(Complaint::class)->findBy([
            'customer' => $user->getCustomer(),
            'period' => $retrievedPeriods,
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
        
        return $this->render('client/detail.html.twig', [
                    'posts' => $retrievedPosts,
                    'period' => $retrievedPeriods,
                    'user' => $user,
                    'timeworked' => $totalTime,
                    'totalprice' => $totalPrice,
                    'totalKm' => $totalKm,
                    'totalpricekm' => $totalpricekm,
                    'complaints' => $retrievedComplaints,
                    'priceToPay' => $totalPrice + $totalpricekm
                ]);
    }
    /**
    * @Route("client/period/{id}/download", name="download_pdf")
    **/
    public function pdf($id)
    {
         // Configure Dompdf according to your needs
         $pdfOptions = new Options();
         $pdfOptions->set('defaultFont', 'Open Sans');
         
         // Instantiate Dompdf with our options
         $dompdf = new Dompdf($pdfOptions);
         
         $em = $this->getDoctrine()->getManager();

         $user = $this->get('security.token_storage')->getToken()->getUser();
         
         $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
             'customer' => $user->getCustomer(),
             'id' => $id
         ]);
 
         $retrievedPosts = $em->getRepository(Post::class)->findBy([
             'customer' => $user->getCustomer(),
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
            'customer' => $user->getCustomer(),
            'posts' => $retrievedPosts,
            'user' => $user,
            'timeworked' => $totalTime,
            'totalprice' => $totalPrice,
            'totalKm' => $totalKm,
            'totalpricekm' => $totalpricekm,
            'priceToPay' => $totalPrice + $totalpricekm
        ]);
        
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
        
         return $this->render('pdf/period.html.twig', [
            'period' => $retrievedPeriods,
            'customer' => $user->getCustomer(),
            'posts' => $retrievedPosts,
            'user' => $user,
            'timeworked' => $totalTime,
            'totalprice' => $totalPrice,
            'totalKm' => $totalKm,
            'totalpricekm' => $totalpricekm,
            'priceToPay' => $totalPrice + $totalpricekm
        ]);
        $this->addFlash('success', 'Pdf gedownload');
         /* return $this->redirectToRoute('detail',array('id' => $id)); */
    }

    public function setActive($id)
    {
        $em = $this->getDoctrine()->getManager();

        $user = $this->get('security.token_storage')->getToken()->getUser();

        $retrievedPeriods = $em->getRepository(Period::class)->findOneBy([
            'customer' => $user->getCustomer(),
            'id' => $id
        ]);

        $retrievedPeriods->setIsConfirmed(true);
        $em->persist($retrievedPeriods);
        $em -> flush();
        $this->addFlash('success', 'Periode goed gekeurd!');
        return $this->redirectToRoute('detail',array('id' => $id));
    }
    /**
    * @Route("client/posts", name="posts")
    **/
    public function posts()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $em = $this->getDoctrine()->getManager();

        $retrievedPosts =  $em->getRepository(Post::class)->findBy([
            'customer' => $user->getCustomer(),
        ]);

        return $this->render('client/posts.html.twig', [
            'posts' => $retrievedPosts,
        ]);

    }

    /**
    * @Route("client/post/{id}", name="post_detail")
    **/
    public function post($id)
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $em = $this->getDoctrine()->getManager();

        $retrievedPosts =  $em->getRepository(Post::class)->findOneBy([
            'customer' => $user->getCustomer(),
            'id' => $id
        ]);

        return $this->render('client/post.html.twig', [
            'post' => $retrievedPosts,
        ]);

    }
}   



