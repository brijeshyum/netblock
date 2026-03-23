package com.netblocker.backend.controller;

import com.netblocker.backend.dto.BlockedSiteRequest;
import com.netblocker.backend.dto.MessageResponse;
import com.netblocker.backend.entity.BlockedSite;
import com.netblocker.backend.entity.User;
import com.netblocker.backend.repository.BlockedSiteRepository;
import com.netblocker.backend.repository.UserRepository;
import com.netblocker.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/block")
public class BlockController {

    @Autowired
    BlockedSiteRepository blockedSiteRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getBlockedSites() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<BlockedSite> sites = blockedSiteRepository.findByUserId(user.getId());
        return ResponseEntity.ok(sites);
    }

    @PostMapping
    public ResponseEntity<?> addBlockedSite(@RequestBody BlockedSiteRequest request) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        if (blockedSiteRepository.existsByUserIdAndUrlAndStatus(user.getId(), request.getUrl(), "ACTIVE")) {
            return ResponseEntity.badRequest().body(new MessageResponse("Site is already blocked!"));
        }

        BlockedSite site = new BlockedSite();
        site.setUser(user);
        site.setUrl(request.getUrl());
        site.setStatus("ACTIVE");

        blockedSiteRepository.save(site);
        return ResponseEntity.ok(new MessageResponse("Site blocked successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeBlockedSite(@PathVariable Long id) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        Optional<BlockedSite> siteOpt = blockedSiteRepository.findById(id);
        if (siteOpt.isPresent() && siteOpt.get().getUser().getId().equals(user.getId())) {
            blockedSiteRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Site removed from blocklist"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Site not found or not owned by user"));
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
