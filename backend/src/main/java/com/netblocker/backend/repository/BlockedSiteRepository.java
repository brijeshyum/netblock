package com.netblocker.backend.repository;

import com.netblocker.backend.entity.BlockedSite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BlockedSiteRepository extends JpaRepository<BlockedSite, Long> {
    List<BlockedSite> findByUserId(Long userId);
    boolean existsByUserIdAndUrlAndStatus(Long userId, String url, String status);
}
