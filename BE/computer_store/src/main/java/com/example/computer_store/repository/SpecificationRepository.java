package com.example.computer_store.repository;

import com.example.computer_store.model.entity.SpecificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecificationRepository extends JpaRepository<SpecificationEntity, Long> {
}