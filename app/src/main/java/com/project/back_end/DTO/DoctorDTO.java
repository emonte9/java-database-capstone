package com.project.back_end.DTO;

import java.util.List;

import com.project.back_end.models.Doctor;

public class DoctorDTO {
    private String name;
    private String email;
    private String specialty;
    private String phone;
    private List<String> availableTimes;

    public DoctorDTO(Doctor doctor) {
        this.name = doctor.getName();
        this.email = doctor.getEmail();
        this.specialty = doctor.getSpecialty();
        this.phone = doctor.getPhone();
        this.availableTimes = doctor.getAvailableTimes();
    }

    // getters...


    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }


    public String getSpecialty() {
        return this.specialty;
    }



    public String getPhone() {
        return this.phone;
    }


    public List<String> getAvailableTimes() {
        return this.availableTimes;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setAvailableTimes(List<String> availableTimes) {
        this.availableTimes = availableTimes;
    }


   

}
