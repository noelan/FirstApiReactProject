<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Facture;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur du mot de passe
     *
     * @var UserPasswordencoderInterface
     */ 
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
        
        // $product = new Product();
        // $manager->persist($product);

        for ($u=0; $u < 10 ; $u++) { 
            $user = new User();

            $hashPassword = $this->encoder->encodePassword($user, "password");

            $number = 1;

            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName())
                 ->setEmail($faker->email)
                 ->setPassword($hashPassword);

                 $manager->persist($user);   
        
            for ($i=0; $i < rand(5, 20); $i++) { 
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                        ->setLastName($faker->lastName())
                        ->setEmail($faker->email)
                        ->setCompany($faker->company)
                        ->setUser($user);
                        
                $manager->persist($customer);         
            
                for ($j=0; $j < rand(3,10) ; $j++) { 
                    $facture = new Facture();
                    $facture->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSendAt($faker->dateTimeBetween('-1 years'))
                            ->setStatus($faker->randomElement(['Envoyé', 'réglé', 'Annuler']))
                            ->setCustomer($customer)
                            ->setNumber($number);
                    $manager->persist($facture);
                    $number++;
                }
            }
        }
        $manager->flush();
    }
}
