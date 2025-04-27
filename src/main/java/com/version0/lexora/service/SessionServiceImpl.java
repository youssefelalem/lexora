package com.version0.lexora.service;

import com.version0.lexora.dto.SessionDTO;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.model.Session;
import com.version0.lexora.model.Utilisateur;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.SessionRepository;
import com.version0.lexora.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of SessionService interface
 */
@Service
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final DossierRepository dossierRepository;
    private final UserRepository userRepository;

    public SessionServiceImpl(
            SessionRepository sessionRepository,
            DossierRepository dossierRepository,
            UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.dossierRepository = dossierRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SessionDTO> getSessionById(Long id) {
        return sessionRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public SessionDTO saveSession(SessionDTO sessionDTO) {
        Session session = convertToEntity(sessionDTO);
        session.setDateCreation(LocalDate.now());
        return convertToDTO(sessionRepository.save(session));
    }

    @Override
    @Transactional
    public SessionDTO updateSession(Long id, SessionDTO sessionDTO) {
        return sessionRepository.findById(id)
                .map(existingSession -> {
                    // Update fields from DTO to entity
                    updateSessionFromDTO(existingSession, sessionDTO);
                    return convertToDTO(sessionRepository.save(existingSession));
                })
                .orElseThrow(() -> new EntityNotFoundException("Session not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found with id: " + id);
        }
        sessionRepository.deleteById(id);
    }

    @Override
    public List<SessionDTO> getSessionsByDossierId(Long dossierId) {
        Dossier dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + dossierId));
        
        return sessionRepository.findByDossier(dossier)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionDTO> getSessionsByDate(LocalDate date) {
        return sessionRepository.findByDate(date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionDTO> getSessionsByStatus(String statut) {
        return sessionRepository.findByStatut(statut)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionDTO> getSessionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return sessionRepository.findByDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionDTO> getUpcomingSessions() {
        return sessionRepository.findByDateAfter(LocalDate.now().minusDays(1)) // Include today
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a Session entity to a SessionDTO
     * @param session the entity to convert
     * @return the corresponding DTO
     */
    private SessionDTO convertToDTO(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setIdSession(session.getIdSession());
        
        if (session.getDossier() != null) {
            dto.setDossierId(session.getDossier().getIdDossier());
            dto.setDossierReference(session.getDossier().getReference());
            dto.setDossierTitre(session.getDossier().getTitre());
        }
        
        dto.setDate(session.getDate());
        dto.setHeure(session.getHeure());
        dto.setSalle(session.getSalle());
        dto.setTribunal(session.getTribunal());
        dto.setStatut(session.getStatut());
        dto.setNotes(session.getNotes());
        dto.setDateCreation(session.getDateCreation());
        dto.setResultatSession(session.getResultatSession());
        dto.setProchaineEtape(session.getProchaineEtape());
        
        if (session.getUtilisateurResponsable() != null) {
            dto.setUtilisateurResponsableId(session.getUtilisateurResponsable().getIdUtilisateur());
            dto.setUtilisateurResponsableNom(session.getUtilisateurResponsable().getNomComplet());
        }
        
        return dto;
    }

    /**
     * Convert a SessionDTO to a Session entity
     * @param sessionDTO the DTO to convert
     * @return the corresponding entity
     */
    private Session convertToEntity(SessionDTO sessionDTO) {
        Session session = new Session();
        
        if (sessionDTO.getIdSession() != null) {
            session.setIdSession(sessionDTO.getIdSession());
        }
        
        if (sessionDTO.getDossierId() != null) {
            Dossier dossier = dossierRepository.findById(sessionDTO.getDossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + sessionDTO.getDossierId()));
            session.setDossier(dossier);
        }
        
        session.setDate(sessionDTO.getDate());
        session.setHeure(sessionDTO.getHeure());
        session.setSalle(sessionDTO.getSalle());
        session.setTribunal(sessionDTO.getTribunal());
        session.setStatut(sessionDTO.getStatut());
        session.setNotes(sessionDTO.getNotes());
        session.setResultatSession(sessionDTO.getResultatSession());
        session.setProchaineEtape(sessionDTO.getProchaineEtape());
        
        if (sessionDTO.getUtilisateurResponsableId() != null) {
            Utilisateur utilisateur = userRepository.findById(sessionDTO.getUtilisateurResponsableId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur not found with id: " + sessionDTO.getUtilisateurResponsableId()));
            session.setUtilisateurResponsable(utilisateur);
        }
        
        return session;
    }
    
    /**
     * Update an existing Session entity with data from a DTO
     * @param session the entity to update
     * @param sessionDTO the DTO containing the new data
     */
    private void updateSessionFromDTO(Session session, SessionDTO sessionDTO) {
        // Only update dossier if specified in DTO
        if (sessionDTO.getDossierId() != null) {
            Dossier dossier = dossierRepository.findById(sessionDTO.getDossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + sessionDTO.getDossierId()));
            session.setDossier(dossier);
        }
        
        // Update primitive fields and objects if not null
        if (sessionDTO.getDate() != null) {
            session.setDate(sessionDTO.getDate());
        }
        if (sessionDTO.getHeure() != null) {
            session.setHeure(sessionDTO.getHeure());
        }
        if (sessionDTO.getSalle() != null) {
            session.setSalle(sessionDTO.getSalle());
        }
        if (sessionDTO.getTribunal() != null) {
            session.setTribunal(sessionDTO.getTribunal());
        }
        if (sessionDTO.getStatut() != null) {
            session.setStatut(sessionDTO.getStatut());
        }
        if (sessionDTO.getNotes() != null) {
            session.setNotes(sessionDTO.getNotes());
        }
        if (sessionDTO.getResultatSession() != null) {
            session.setResultatSession(sessionDTO.getResultatSession());
        }
        if (sessionDTO.getProchaineEtape() != null) {
            session.setProchaineEtape(sessionDTO.getProchaineEtape());
        }
        
        // Only update utilisateurResponsable if specified in DTO
        if (sessionDTO.getUtilisateurResponsableId() != null) {
            Utilisateur utilisateur = userRepository.findById(sessionDTO.getUtilisateurResponsableId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur not found with id: " + sessionDTO.getUtilisateurResponsableId()));
            session.setUtilisateurResponsable(utilisateur);
        }
    }
}