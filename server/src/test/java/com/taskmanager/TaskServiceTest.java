package com.taskmanager;

import com.taskmanager.entity.Task;
import com.taskmanager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Test
    void create_and_findAll() {
        Task task = taskService.create("Test task", "A description", null);
        assertThat(task.getId()).isNotNull();
        assertThat(task.getTitle()).isEqualTo("Test task");
        assertThat(task.getStatus()).isEqualTo("pending");

        List<Task> all = taskService.findAll();
        assertThat(all).hasSizeGreaterThanOrEqualTo(1);
        assertThat(all.stream().anyMatch(t -> "Test task".equals(t.getTitle()))).isTrue();
    }

    @Test
    void findById_exists() {
        Task created = taskService.create("Find me", null, "in_progress");
        Optional<Task> found = taskService.findById(created.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Find me");
        assertThat(found.get().getStatus()).isEqualTo("in_progress");
    }

    @Test
    void findById_notExists() {
        Optional<Task> found = taskService.findById(99999L);
        assertThat(found).isEmpty();
    }

    @Test
    void update() {
        Task created = taskService.create("Original", "Desc", null);
        Optional<Task> updated = taskService.update(created.getId(), "Updated", "New desc", "done");
        assertThat(updated).isPresent();
        assertThat(updated.get().getTitle()).isEqualTo("Updated");
        assertThat(updated.get().getStatus()).isEqualTo("done");
    }

    @Test
    void deleteById() {
        Task created = taskService.create("Delete me", null, null);
        Optional<Task> deleted = taskService.deleteById(created.getId());
        assertThat(deleted).isPresent();
        assertThat(taskService.findById(created.getId())).isEmpty();
    }
}
