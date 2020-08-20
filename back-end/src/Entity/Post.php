<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\PostRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinColumn;

use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ApiResource(normalizationContext={"groups"={"post"}})
 * @ApiResource(attributes={"pagination_client_enabled"=true})
 * @ORM\Entity(repositoryClass=PostRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"user": "exact", "customer": "exact"})
 * @ApiFilter(OrderFilter::class, properties={"date", "name"}, arguments={"orderParameterName"="order"})
 * @ApiFilter(DateFilter::class, properties={"date"})
 *
 */
class Post
{
    /**
     * @Groups("user")
     * @Groups({"post"})
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     *   @Groups("user")
     * @Groups({"post"})
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @Groups({"post"})
     *  @Groups("user")
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     *  @Groups("user")
     * @Groups({"post"})
     * @ORM\Column(type="boolean")
     */
    private $finished;


    /**
     *  
     * @Groups({"post"})
     * @ORM\Column(type="integer", nullable=false)
     */
    private $transport;

    /**
     * 
     * @Groups({"post"})
     * @ORM\Column(type="string")
     * @Assert\Time
     * @var string A "H:i:s" formatted value
     */
    private $pauze;

   /**
     *  
     * @Groups({"post"})
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="posts")
     * @JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     * 
     */
    private $user; 

    /**
     * @Groups("user")
     * @Groups({"post"})
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="posts")
     * @JoinColumn(name="customer_id", referencedColumnName="id", nullable=false)
     */
    private $customer;

    /**
     *  @Groups("user")
     * @Groups({"post"})
     * @ORM\ManyToMany(targetEntity="App\Entity\Material", mappedBy="posts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $materials;

    /**
     * @Groups({"user"})
     * @Groups({"post"})
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @Groups("user")
     * @Groups({"post"})
     * @ORM\Column(type="string")
     * @Assert\Time
     * @ORM\Column(type="string")
     * @Assert\Time
     */
    private $start;

    /**
     * @Groups({"post"})
     * @ORM\Column(type="string")
     * @Assert\Time
     * @var string A "H:i:s" formatted value
     */
    private $stop;

    /**
     * @Groups({"post"})
     * @ORM\ManyToOne(targetEntity=Period::class, inversedBy="posts")
     */
    private $period;


    public function __construct()
    {
        $this->materials = new ArrayCollection();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getFinished(): ?bool
    {
        return $this->finished;
    }

    public function setFinished(bool $finished): self
    {
        $this->finished = $finished;

        return $this;
    }
    
    public function getTransport(): ?int
    {
        return $this->transport;
    }

    public function setTransport(?int $transport): self
    {
        $this->transport = $transport;

        return $this;
    }

    public function getPauze(): ?string
    {
        return $this->pauze;
    }

    public function setPauze(?string $pauze): self
    {
        $this->pauze = $pauze;

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

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }
    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;
        return $this;
    }

    /**
    * @return Collection|Material[]
    */
    public function getMaterials(): Collection
    {
        return $this->materials;
    }
    public function addMaterial(Material $material): self
    {
        if (!$this->materials->contains($material)) {
            $this->materials[] = $material;
            $material->addPost($this);
        }
        return $this;
    }
    public function removeMaterial(Material $material): self
    {
        if ($this->materials->contains($material)) {
            $this->materials->removeElement($material);
            $material->removePost($this);
        }
        return $this;
    }
    
    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }
    public function __toString()
    {
        //return $this->title;
        return $this->title;
    }

    public function getStart(): ?string
    {
        return $this->start;
    }

    public function setStart(string $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getStop(): ?string
    {
        return $this->stop;
    }

    public function setStop(?string $stop): self
    {
        $this->stop = $stop;

        return $this;
    }

    public function getPeriod(): ?Period
    {
        return $this->period;
    }

    public function setPeriod(?Period $period): self
    {
        $this->period = $period;
        
        return $this;
    }



}
