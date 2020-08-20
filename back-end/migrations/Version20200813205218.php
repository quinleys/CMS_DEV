<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200813205218 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE period (id INT AUTO_INCREMENT NOT NULL, customer_id INT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, is_confirmed TINYINT(1) NOT NULL, INDEX IDX_C5B81ECE9395C3F3 (customer_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECE9395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id)');
        $this->addSql('ALTER TABLE post ADD period_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DEC8B7ADE FOREIGN KEY (period_id) REFERENCES period (id)');
        $this->addSql('CREATE INDEX IDX_5A8A6C8DEC8B7ADE ON post (period_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8DEC8B7ADE');
        $this->addSql('DROP TABLE period');
        $this->addSql('DROP INDEX IDX_5A8A6C8DEC8B7ADE ON post');
        $this->addSql('ALTER TABLE post DROP period_id');
    }
}
