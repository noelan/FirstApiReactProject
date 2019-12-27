<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 * @ApiResource(
 *  collectionOperations={"GET","POST"},
 *  itemOperations={"GET","PUT","DELETE"},
 *  subresourceOperations={
 *      "factures_get_subresource"={"path"="/customers/{id}/factures"}
 *  },
 *  normalizationContext={
 *      "groups"={"customers_read"} 
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"firstName":"partial", "factures.id"="partial"})
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "facture_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "facture_read"})
     * @Assert\NotBlank(message="le prénom est obligatoire")
     * @Assert\Length(min=3, minMessage="Le prénom doit faire mini 5 caractere et max 210", max="255", maxMessage="max 255")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "facture_read"})
     * @Assert\NotBlank(message="le lastname est obligatoire")
     * @Assert\Length(min=3, minMessage="Le prénom doit faire mini 5 caractere et max 210", max="255", maxMessage="max 255")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "facture_read"})
     */
    private $company;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "facture_read"})
     * @Assert\NotBlank(message="le email est obligatoire")
     * @Assert\Length(min=3, minMessage="Le email doit faire mini 5 caractere et max 210", max="255", maxMessage="max 255")
     * @Assert\Email(message="le format de l'email doit etre valide")
     */
    private $email;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Facture", mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource
     */
    private $factures;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
     * @Groups({"customers_read", "facture_read"})
     * @Assert\NotBlank(message="le user est obligatoire")
     */
    private $user;

    public function __construct()
    {
        $this->factures = new ArrayCollection();
    }

    /**
     * Return le montant total de toutes les factures
     * @Groups({"facture_read","customers_read"})
     * @return float
     */
    public function getTotalAmount(): float
    {

        return array_reduce($this->factures->toArray(), function ($total, $facture) {
            return $total + $facture->getAmount();
        }, 0);
    }

    /**
     * Return le montant total non payé (hors facture payées ou annulées)
     * @Groups({"facture_read", "customers_read"})
     * @return float
     */
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->factures->toArray(), function ($total, $facture) {
            return $total + ($facture->getStatus() === "réglé" || $facture->getStatus() === "Annuler" ? 0 : $facture->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection|Facture[]
     */
    public function getFactures(): Collection
    {
        return $this->factures;
    }

    public function addFacture(Facture $facture): self
    {
        if (!$this->factures->contains($facture)) {
            $this->factures[] = $facture;
            $facture->setCustomer($this);
        }

        return $this;
    }

    public function removeFacture(Facture $facture): self
    {
        if ($this->factures->contains($facture)) {
            $this->factures->removeElement($facture);
            // set the owning side to null (unless already changed)
            if ($facture->getCustomer() === $this) {
                $facture->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
