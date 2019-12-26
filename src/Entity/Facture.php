<?php

namespace App\Entity;


use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FactureRepository")
 * @ApiResource(
 *  subresourceOperations={
 *   "api_customers_factures_get_subresource"={
 *      "normalization_context"={"groups"={"factures_subresource"}}
 *      }
 *  },
 *  itemOperations={"GET", "PUT", "DELETE", "increment"={
 * "method"="post", 
 * "path"="/factures/{id}/increment",
 * "controller"="App\Controller\FactureIncrementController",
 * "openapi_context"={"summary"="haha sa incremente","description"="description"}
 *   }
 *},
 *  attributes = {
 *      "pagination_enabled"=false,     
 *      "pagination_items_per_page"=40,
 *      "order": {"sendAt":"desc"}
 *  },
 *  normalizationContext={"groups"={"facture_read"}},
 *  denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount","sendAt"})
 */
class Facture
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"facture_read","customers_read", "factures_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"facture_read","customers_read", "factures_subresource"})
     * @Assert\NotBlank(message="le montant doit etre obligatoire!")
     * @Assert\Type(type="numeric", message="le montant doit etre numerique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"facture_read","customers_read", "factures_subresource"})
     * @Assert\NotBlank(message="champ sendAT obligatoire")
     */
    private $sendAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"facture_read","customers_read", "factures_subresource"})
     * @Assert\NotBlank(message="champ status obligatoire")
     * @Assert\Choice(choices={"Envoyé", "Annuler", "réglé"}, message="le statut doit être Envoyé, Annuler ou réglé")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="factures")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"facture_read"})
     * @Assert\NotBlank(message="champ customer obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"facture_read","customers_read", "factures_subresource"})
     * @Assert\NotBlank(message="champ chrono obligatoire")
     */
    private $number;


    /**
     * Return le User de la facture
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSendAt(): ?\DateTimeInterface
    {
        return $this->sendAt;
    }

    public function setSendAt(\DateTimeInterface $sendAt): self
    {
        $this->sendAt = $sendAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
    {
        $this->number = $number;

        return $this;
    }
}
