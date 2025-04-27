package com.version0.lexora.controller;

import com.version0.lexora.dto.SessionDTO;
import com.version0.lexora.service.SessionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Session operations
 */
@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    
    private final SessionService sessionService;
    
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    /**
     * Get all sessions
     * @return List of all sessions
     */
    @GetMapping
    public ResponseEntity<List<SessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }
    
    /**
     * Get session by ID
     * @param id Session ID
     * @return Session with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new session
     * @param sessionDTO Session data transfer object
     * @return Created session
     */
    @PostMapping
    public ResponseEntity<SessionDTO> createSession(@RequestBody SessionDTO sessionDTO) {
        return new ResponseEntity<>(sessionService.saveSession(sessionDTO), HttpStatus.CREATED);
    }
    
    /**
     * Update existing session
     * @param id Session ID
     * @param sessionDTO Updated session data
     * @return Updated session
     */
    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(@PathVariable Long id, @RequestBody SessionDTO sessionDTO) {
        return ResponseEntity.ok(sessionService.updateSession(id, sessionDTO));
    }
    
    /**
     * Delete session by ID
     * @param id Session ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get sessions by dossier ID
     * @param dossierId Dossier ID
     * @return List of sessions for the specified dossier
     */
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByDossierId(@PathVariable Long dossierId) {
        return ResponseEntity.ok(sessionService.getSessionsByDossierId(dossierId));
    }
    
    /**
     * Get sessions by date
     * @param date Session date
     * @return List of sessions on the specified date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<SessionDTO>> getSessionsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(sessionService.getSessionsByDate(date));
    }
    
    /**
     * Get sessions by status
     * @param statut Session status
     * @return List of sessions with the specified status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<SessionDTO>> getSessionsByStatus(@PathVariable String statut) {
        return ResponseEntity.ok(sessionService.getSessionsByStatus(statut));
    }
    
    /**
     * Get sessions between two dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of sessions between the specified dates
     */
    @GetMapping("/period")
    public ResponseEntity<List<SessionDTO>> getSessionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(sessionService.getSessionsByDateRange(startDate, endDate));
    }
    
    /**
     * Get upcoming sessions (sessions with date >= today)
     * @return List of upcoming sessions
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<SessionDTO>> getUpcomingSessions() {
        return ResponseEntity.ok(sessionService.getUpcomingSessions());
    }
}