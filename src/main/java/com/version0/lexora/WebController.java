package com.version0.lexora;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/{path:[^\\.]*}")
    public String forward() {
        return "forward:/";
    }
}
