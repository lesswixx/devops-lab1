# Лабораторная работа №2 — Гайд по выполнению

Чек-лист по заданиям: что уже сделано в репозитории и что нужно сделать самостоятельно.

---

## Задание 1. Изучить основы IaC (инфраструктура как код)

**Что сделать:** Изучить работу с инструментом управления инфраструктурой как кодом (Terraform, Ansible).

**Статус:** теория самостоятельно; практика — в заданиях 2 и 3 (конфиги уже в репо).

**Кратко:**
- **Terraform** — декларативное описание облачных ресурсов (ВМ, сети) в `.tf`; команды `init` → `plan` → `apply`.
- **Ansible** — плейбуки (YAML) и инвентори; команда `ansible-playbook` выполняет задачи на удалённых хостах по SSH (установка пакетов, сервисов и т.д.).

**Документация:** [Terraform](https://developer.hashicorp.com/terraform/docs), [Ansible](https://docs.ansible.com/).

---

## Задание 2. Развернуть ВМ в облаке с помощью Terraform

**Что сделать:** Развернуть ВМ в облаке через Terraform (установка ПО на ВМ — конфигами; Docker ставим в задании 3 через Ansible).

**Статус:** конфиги есть в репозитории (`terraform/`), нужно подставить свои данные и выполнить команды.

### Что уже в репо

| Файл | Назначение |
|------|------------|
| `terraform/main.tf` | Провайдер Yandex Cloud, сеть, подсеть, ВМ Ubuntu 22.04 с SSH-ключом |
| `terraform/variables.tf` | Переменные: токен, cloud_id, folder_id, путь к SSH-ключу |
| `terraform/outputs.tf` | Вывод публичного IP и команды SSH |
| `terraform/terraform.tfvars.example` | Пример файла с переменными (скопировать в `terraform.tfvars`) |

### Что сделать тебе

1. Установить [Terraform](https://developer.hashicorp.com/terraform/install).
2. Завести аккаунт [Yandex Cloud](https://cloud.yandex.ru/), установить [YC CLI](https://cloud.yandex.ru/docs/cli/quickstart) и выполнить `yc init`.
3. Узнать ID облака и каталога: `yc config get cloud-id`, `yc config get folder-id`. Создать токен: `yc iam create-token`.
4. В каталоге `terraform/`:
   - скопировать `terraform.tfvars.example` в `terraform.tfvars`;
   - вписать в `terraform.tfvars` значения `yandex_token`, `yandex_cloud_id`, `yandex_folder_id`;
   - убедиться, что есть ключ `~/.ssh/id_rsa.pub` (или задать `ssh_public_key_path`).
5. Выполнить:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```
6. После `apply` вывести IP: `terraform output vm_public_ip`. Подключиться: `ssh ubuntu@<IP>`.

---

## Задание 3. Установить Docker на ВМ с помощью Ansible

**Что сделать:** Установить Docker на ВМ через Ansible (конфиги в репозитории).

**Статус:** плейбук и пример инвентори в репо (`ansible/`), нужно подставить IP ВМ и запустить плейбук.

### Что уже в репо

| Файл | Назначение |
|------|------------|
| `ansible/playbook.yml` | Установка Docker CE на Ubuntu (apt, сервис, пользователь `ubuntu` в группе `docker`) |
| `ansible/inventory.yml.example` | Пример инвентори с одним хостом (user ubuntu, SSH-ключ) |

### Что сделать тебе

1. Установить Ansible: `pip install ansible` или `brew install ansible`.
2. Взять IP ВМ из вывода Terraform: `terraform -chdir=terraform output -raw vm_public_ip`.
3. Скопировать инвентори и подставить IP:
   ```bash
   cp ansible/inventory.yml.example ansible/inventory.yml
   # В inventory.yml заменить 0.0.0.0 на IP ВМ
   ```
4. Запустить плейбук:
   ```bash
   cd ansible
   ansible-playbook -i inventory.yml playbook.yml
   ```
5. Проверить Docker на ВМ: `ssh ubuntu@<IP> docker run hello-world` (после плейбука пользователь в группе `docker`, может понадобиться перелогиниться).

---

## Задание 4. Dockerfile для server/client, docker-compose, реестр образов

**Что сделать:**  
- Отдельный Dockerfile для серверного приложения.  
- Отдельный Dockerfile для клиентского приложения.  
- `docker-compose.yml` минимум из 3 сервисов: серверное приложение, клиентское приложение, база данных.  
- Собрать образы и сохранить их в облачном реестре Docker-образов.

**Статус:** сделано в репозитории.

### Что уже есть

| Элемент | Где лежит | Кратко |
|--------|-----------|--------|
| Dockerfile сервера | `server/Dockerfile` | Maven → JAR, образ на JRE 21, подключение к PostgreSQL |
| Dockerfile клиента | `client/Dockerfile` | Node → build, nginx раздаёт статику и проксирует `/api` на сервер |
| Конфиг nginx для клиента | `client/nginx.conf` | Проксирование `/api` на `server:3001` |
| docker-compose | `docker-compose.yml` в корне | 3 сервиса: `db` (PostgreSQL), `server`, `client` |
| Инструкции по реестру | README (раздел Docker) | Сборка, теги, push в Docker Hub и ghcr.io |

### Что нужно сделать тебе

1. **Проверить запуск локально**
   ```bash
   docker compose up --build
   ```
   Открыть в браузере: http://localhost

2. **Собрать образы и отправить в облачный реестр** (Docker Hub или GitHub Container Registry), как в README:
   - залогиниться в реестр;
   - сделать `docker compose build`, протегировать образы под свой логин/реестр;
   - выполнить `docker push` для образов `taskmanager-server` и `taskmanager-client`.

3. **Для отчёта/защиты** можно приложить:
   - скрин или вывод `docker images` с твоими образами;
   - ссылки на образы в реестре (например, `docker.io/lesswixx/taskmanager-server:latest` и аналог для client).

---

## Краткая сводка

| № | Задание | Статус |
|---|---------|--------|
| 1 | Основы IaC | Теория самостоятельно; практика в заданиях 2–3 |
| 2 | ВМ через Terraform | Конфиги в `terraform/`; нужно: аккаунт Yandex Cloud, terraform.tfvars, `apply` |
| 3 | Docker через Ansible | Плейбук в `ansible/`; нужно: inventory с IP ВМ, `ansible-playbook` |
| 4 | Dockerfile + compose + реестр | Всё в репо; осталось: `docker compose up`, push образов в реестр |

После 2 и 3 можно развернуть приложение из задания 4 на ВМ: скопировать проект на ВМ и выполнить `docker compose up --build`, либо настроить CI/CD на деплой в облако.
