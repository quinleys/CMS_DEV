<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
class PageController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function home(Request $request): Response
    {
        $user = $this->getUser();

        if($user == null){
            return new RedirectResponse('/login');
        }
    else if ($user->getRoles() == ['ROLE_CLIENT']) {
        return new RedirectResponse('/client');
    }else if($user->getRoles() == ['ROLE_ADMIN']){
        return new RedirectResponse('/backend');
    }
}

}
