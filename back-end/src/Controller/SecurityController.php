<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
       
        $user = $this->getUser();
        if($user !== null){
            if ($user->getRoles() == ['ROLE_CLIENT']) {
                return new RedirectResponse('/client');
                }else if($user->getRoles() == ['ROLE_ADMIN']){
                    return new RedirectResponse('/backend');
                }else if($user->getRoles() == ['ROLE_ONDERAANNEMER'] || $user->getRoles() == ['ROLE_USER']){
                    return new RedirectResponse('/logout');
                }
                
        } 
      
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();
        /* if($this->getUser()){

        
       
        $user = $this->getUser();
        if ($user->getRoles() == "USER_CLIENT") {
            return $this->redirectToRoute('client');
        }else if($user->getRoles() == "USER_ADMIN"){
            return $this->redirectToRoute('backend');
        }
    } */
        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout()
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
