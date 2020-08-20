<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CustomerRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinColumn;

use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(normalizationContext={"groups"={"customer"}})
 * @ApiResource()
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @Groups("customer")
     * @Groups({"post"})
     * @Groups({"user"})
     * @ORM\Column(type="integer")
     * 
     */
    private $id;

    /**
     * 
     * @Groups("customer")
     * @ORM\Column(type="string", length=255)
     * @Groups("post")
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $phone;

    /**
     * @Groups("customer")
     * @ORM\Column(type="string", length=255)
     */
    private $adress;

     /**
     * @ORM\OneToMany(targetEntity="App\Entity\Post", mappedBy="customer")
     */
    private $posts;

    /**
     * @Groups("customer")
     * @ORM\OneToMany(targetEntity=Period::class, mappedBy="customer")
     */
    private $periods;

    /**
     * @ORM\OneToMany(targetEntity=Complaint::class, mappedBy="customer")
     */
    private $complaints;


    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->periods = new ArrayCollection();
        $this->complaints = new ArrayCollection();
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

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

    public function getPhone(): ?int
    {
        return $this->phone;
    }

    public function setPhone(?int $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getAdress(): ?string
    {
        return $this->adress;
    }

    public function setAdress(string $adress): self
    {
        $this->adress = $adress;

        return $this;
    }
    /**
    * @return Collection|Post[]
    */
    public function getPosts(): Collection
    {
        return $this->posts;
    }
    public function addPost(Post $post): self
    {
        if (!$this->posts->contains($post)) {
            $this->posts[] = $post;
            $post->setCustomer($this);
        }
        return $this;
    }
    public function removePost(Post $post): self
    {
        if ($this->posts->contains($post)) {
            $this->posts->removeElement($post);
            // set the owning side to null (unless already changed)
            if ($post->getCustomer() === $this) {
                $post->setCustomer(null);
            }
        }
        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }

    /**
     * @return Collection|Period[]
     */
    public function getPeriods(): Collection
    {
        return $this->periods;
    }

    public function addPeriod(Period $period): self
    {
        if (!$this->periods->contains($period)) {
            $this->periods[] = $period;
            $period->setCustomer($this);
        }

        return $this;
    }

    public function removePeriod(Period $period): self
    {
        if ($this->periods->contains($period)) {
            $this->periods->removeElement($period);
            // set the owning side to null (unless already changed)
            if ($period->getCustomer() === $this) {
                $period->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Complaint[]
     */
    public function getComplaints(): Collection
    {
        return $this->complaints;
    }

    public function addComplaint(Complaint $complaint): self
    {
        if (!$this->complaints->contains($complaint)) {
            $this->complaints[] = $complaint;
            $complaint->setCustomer($this);
        }

        return $this;
    }

    public function removeComplaint(Complaint $complaint): self
    {
        if ($this->complaints->contains($complaint)) {
            $this->complaints->removeElement($complaint);
            // set the owning side to null (unless already changed)
            if ($complaint->getCustomer() === $this) {
                $complaint->setCustomer(null);
            }
        }

        return $this;
    }  

}
