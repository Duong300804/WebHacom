package com.example.computer_store.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "email",length = 50)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role", length = 50)
    private String role;

    @Column(name = "position", length = 255)
    private String position;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "address")
    private String address;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", length = 19)
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at", length = 19)
    private Date updateDate;

    @Column(name = "delete_flag", length = 1)
    private String deleteFlag;
}
