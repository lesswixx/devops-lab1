package com.taskmanager.controller;

import com.taskmanager.entity.Task;
import com.taskmanager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private static final List<String> VALID_STATUSES = List.of("pending", "in_progress", "done");

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAll() {
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String title = body != null ? body.get("title") : null;
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Title is required"));
        }
        String status = body.get("status");
        if (status != null && !VALID_STATUSES.contains(status)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
        Task task = taskService.create(title, body.get("description"), status);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        if (body != null && body.containsKey("title") && (body.get("title") == null || body.get("title").trim().isEmpty())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Title cannot be empty"));
        }
        String status = body != null ? body.get("status") : null;
        if (status != null && !VALID_STATUSES.contains(status)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
        String title = body != null ? body.get("title") : null;
        String description = body != null ? body.get("description") : null;
        return taskService.update(id, title, description, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return taskService.deleteById(id)
                .map(task -> ResponseEntity.ok(Map.of("message", "Task deleted", "task", task)))
                .orElse(ResponseEntity.notFound().build());
    }
}
