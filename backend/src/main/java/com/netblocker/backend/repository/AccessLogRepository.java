package com.netblocker.backend.repository;

import com.netblocker.backend.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    List<AccessLog> findByUserIdOrderByTimestampDesc(Long userId);
}
