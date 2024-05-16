package com.kob.backend.controller.administrator;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.service.administrator.GetAdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class GetAdministratorController {
    @Autowired
    private GetAdministratorService getAdministratorService;

    @GetMapping("/administrator/getlist")
    public JSONObject getList(@RequestParam Map<String, String> data) {
        Integer page = Integer.parseInt(data.get("page"));
        return getAdministratorService.getList(page);
    }
}