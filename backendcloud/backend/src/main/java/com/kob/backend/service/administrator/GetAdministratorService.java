package com.kob.backend.service.administrator;

import com.alibaba.fastjson.JSONObject;

public interface GetAdministratorService {
    JSONObject getList(Integer page);
}
