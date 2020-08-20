<?php

namespace App\Form;

use App\Entity\Complaint;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class ComplaintType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, [
                'attr'=> [
                    'placeholder' =>'Geef meer informatie over het probleem',
                ]
              
            ])
            ->add('description', TextareaType::class, [
                'attr'=> [
                    'placeholder' =>'Wat is het probleem?',
                ]
            ])
            /* ->add('isFixed') */
            /* ->add('period')
            ->add('customer') */
            ->add('Opslaan', SubmitType::class, [
                'attr' => [
                    'class' => 'btn btn-primary w-100'
                ]
            ]) 
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Complaint::class,
        ]);
    }
}
