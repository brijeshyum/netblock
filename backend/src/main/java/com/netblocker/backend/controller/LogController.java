package com.netblocker.backend.controller;

import com.netblocker.backend.dto.AccessLogRequest;
import com.netblocker.backend.dto.MessageResponse;
import com.netblocker.backend.entity.AccessLog;
import com.netblocker.backend.entity.User;
import com.netblocker.backend.repository.AccessLogRepository;
import com.netblocker.backend.repository.UserRepository;
import com.netblocker.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    AccessLogRepository accessLogRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getLogs() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<AccessLog> logs = accessLogRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<?> addLog(@RequestBody AccessLogRequest request) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        AccessLog log = new AccessLog();
        log.setUser(user);
        log.setUrl(request.getUrl());
        log.setStatus(request.getStatus());
        log.setTimestamp(LocalDateTime.now());

        accessLogRepository.save(log);
        return ResponseEntity.ok(new MessageResponse("Log added successfully"));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            return userRepository.findById(userDetails.getId()).orElse(null);
        }
        return null;
    }
}
