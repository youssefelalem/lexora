package com.version0.lexora.service;

import com.version0.lexora.dto.SessionDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Session operations
 */
public interface SessionService {
    
    /**
     * Get all sessions
     * @return List of all sessions
     */
    List<SessionDTO> getAllSessions();
    
    /**
     * Get session by ID
     * @param id Session ID
     * @return Optional containing the session if found, empty otherwise
     */
    Optional<SessionDTO> getSessionById(Long id);
    
    /**
     * Create or update a session
     * @param sessionDTO Session data transfer object
     * @return Created or updated session
     */
    SessionDTO saveSession(SessionDTO sessionDTO);
    
    /**
     * Update existing session
     * @param id Session ID
     * @param sessionDTO Updated session data
     * @return Updated session
     */
    SessionDTO updateSession(Long id, SessionDTO sessionDTO);
    
    /**
     * Delete session by ID
     * @param id Session ID
     */
    void deleteSession(Long id);
    
    /**
     * Get sessions by dossier ID
     * @param dossierId Dossier ID
     * @return List of sessions for the specified dossier
     */
    List<SessionDTO> getSessionsByDossierId(Long dossierId);
    
    /**
     * Get sessions by date
     * @param date Session date
     * @return List of sessions on the specified date
     */
    List<SessionDTO> getSessionsByDate(LocalDate date);
    
    /**
     * Get sessions by status
     * @param statut Session status
     * @return List of sessions with the specified status
     */
    List<SessionDTO> getSessionsByStatus(String statut);
    
    /**
     * Get sessions between two dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of sessions between the specified dates
     */
    List<SessionDTO> getSessionsByDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get upcoming sessions (sessions with date >= today)
     * @return List of upcoming sessions
     */
    List<SessionDTO> getUpcomingSessions();
}