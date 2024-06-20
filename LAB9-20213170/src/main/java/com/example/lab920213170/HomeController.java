package com.example.lab920213170;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @GetMapping(value = {""})
    public String vistaPrincipal() {
        return "index";
    }


}