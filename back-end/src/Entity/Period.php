<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\PeriodRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=PeriodRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"customer": "exact"})
 * @ApiFilter(OrderFilter::class, properties={"date", "name"}, arguments={"orderParameterName"="order"})
 * @ApiFilter(DateFilter::class, properties={"date"})
 * @ApiFilter(BooleanFilter::class, properties={"isConfirmed"})
 */
class Period
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @Groups("customer")
     * @ORM\Column(type="integer")
     *  @Groups({"post"})
     */
    private $id;
    /**
     * @Groups("customer")
     * @ORM\Column(type="string", length=255)
     * 
     */
    private $title;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="periods")
     * @ORM\JoinColumn(nullable=false)
     */
    private $customer;

    /**
     * @Groups("customer")
     * @ORM\Column(type="date")
     */
    private $startDate;

    /**
     * @Groups("customer")
     * @ORM\Column(type="date")
     */
    private $endDate;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isConfirmed;

    /**
     * @ORM\OneToMany(targetEntity=Post::class, mappedBy="period")
     */
    private $posts;

    /**
     * @ORM\OneToMany(targetEntity=Complaint::class, mappedBy="period")
     */
    private $complaints;
    
    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->isConfirmed = false;
        $this->complaints = new ArrayCollection();
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
    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getIsConfirmed(): ?bool
    {
        return $this->isConfirmed;
    }

    public function setIsConfirmed(bool $isConfirmed): self
    {
        $this->isConfirmed = $isConfirmed;

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
    
            $post->setPeriod($this);
        }

        return $this;
    }

    public function removePost(Post $post): self
    {
        if ($this->posts->contains($post)) {
            $this->posts->removeElement($post);
            // set the owning side to null (unless already changed)
            if ($post->getPeriod() === $this) {
                $post->setPeriod(null);
            }
        }

        return $this;
    }
    public function __toString()
    {
        return (string) $this->title;
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
            $complaint->setPeriod($this);
        }

        return $this;
    }

    public function removeComplaint(Complaint $complaint): self
    {
        if ($this->complaints->contains($complaint)) {
            $this->complaints->removeElement($complaint);
            // set the owning side to null (unless already changed)
            if ($complaint->getPeriod() === $this) {
                $complaint->setPeriod(null);
            }
        }

        return $this;
    }
}
