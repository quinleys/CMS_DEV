<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\Serializer\Annotation\Groups;
/**
 * @ApiResource(normalizationContext={"groups"={"user"}})
 * @ApiResource
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("post")
     * @Groups({"user"})
     * 
     */
    private $id;

    /**
     * @Groups({"user"})
     * @ORM\Column(type="string", length=180)
     */
    private $firstName;
    /**
     * @Groups({"user"})
     * @ORM\Column(type="string", length=180)
     */
    private $lastName;
    /**
     * @Groups({"user"})
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * 
     *@Groups({"user"})
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     *  
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @Groups({"user"})
     * @ORM\Column(type="string", length=255)
     */
    private $username;

     /**
     * @Groups({"user"})
     * @ORM\Column(type="integer")
     */
    private $uurtarief;

    /**
     * @Groups({"user"})
     * @ORM\Column(type="integer")
     */
    private $transportkost;
    
     /**
      * @Groups({"user"})
     * @ORM\OneToMany(targetEntity="App\Entity\Post", mappedBy="user")
     */
    private $posts;
    /**
     * @Groups({"user"})
     * @ORM\OneToOne(targetEntity="App\Entity\Customer")
     * @ORM\JoinColumn(name="customer_id",referencedColumnName="id")
     */
    private $customer;
    
    public function __construct()
    {
        $this->posts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getEmail(): ?string
    {
        return $this->email;
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
    public function getUurtarief(): ?int
    {
        return $this->uurtarief;
    }
    public function getTransportkost(): ?int
    {
        return $this->transportkost;
    }
    public function setUurTarief(?int $uurtarief):self
    {
        $this->uurtarief = $uurtarief;
        return $this;
    }
    public function setTransportKost(?int $transportkost):self
    {
        $this->transportkost = $transportkost;
        return $this;
    }
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }
    public function getCustomer(){
        return $this->customer;
    }
    public function setCustomer(Customer $customer):self
    {
        $this->customer = $customer;
        return $this;
    }
    /**
     * @return Collection|Posts[]
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): self
    {
        if (!$this->posts->contains($post)) {
            $this->posts[] = $post;
            $post->setUser($this);
        }
        return $this;
    }
    public function removePost(Post $post): self
    {
        if ($this->posts->contains($post)) {
            $this->posts->removeElement($post);
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }
        return $this;
    }
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        /* // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER'; */
        
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function __toString()
    {
        return $this->email;
    }


}
