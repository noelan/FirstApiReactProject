<?php

namespace App\Controller;

use App\Entity\Facture;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class FactureIncrementController
{
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Facture $data)
    {
        $data->setNumber($data->getNumber( + 1));
        $this->manager->flush();
        return $data;
    }
}
