package com.asm.restController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;
import com.asm.dao.AccountDAO;
import com.asm.dao.RoleDAO;
import com.asm.entity.Account;
import com.asm.entity.Role;
import com.asm.service.FileManagerService;
import com.asm.service.ParamService;
import com.asm.service.UsernameGenerator;

@CrossOrigin("*")
@RestController
public class AuthRestController {
    @Autowired
    AccountDAO dao;

    @Autowired
    RoleDAO roledao;

    @Autowired
    UsernameGenerator user;

    @Autowired
    ParamService prs;

    // @GetMapping("/rest/authorities")
    // public Map<String, Object>getAuthorities(){
    // Map<String,Object> data = new HashMap<>();
    // data.put("accounts",dao.findAll());
    // data.put("role",roledao.findAll());
    // return data;
    // }

    @GetMapping("/rest/authorities")
    public ResponseEntity<List<Account>> getAll(Model model) {
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/rest/roles")
    public ResponseEntity<List<Role>> getAllRole(Model model) {
        return ResponseEntity.ok(roledao.findAll());
    }

    @GetMapping("/rest/authorities/{username}")
    public ResponseEntity<Account> getOne(@PathVariable("username") String username) {
        if (!dao.existsById(username)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dao.findByUsernameOrEmail(username, username));
    }

    @GetMapping("/rest/authorities/profile")
    public ResponseEntity<Account> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            // Lấy thông tin tài khoản từ username
            Account optionalAccount = dao.findByEmail(username);
            System.out.println("************************");
            System.out.println("************************" + optionalAccount.getFullname());

            // Trả về ResponseEntity chứa thông tin Account
            return ResponseEntity.ok(optionalAccount);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // @GetMapping("/rest/role/{select}")
    // public ResponseEntity<Optional<Account>>
    // getRole(@PathVariable("selectedRole") String username) {
    // if (!dao.existsById(username)) {
    // return ResponseEntity.notFound().build();
    // }
    // return ResponseEntity.ok(dao.findByUsernameOrEmail(username, username));
    // }

    @PostMapping("/rest/create/account")
    public ResponseEntity<Account> create(@RequestBody Account account) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(account.getPassword());
        String usernem = user.generateUniqueUsername();
        account.setUsername(usernem);
        System.err.println("*****************" + usernem);
        account.setPassword(hashedPassword);
        return ResponseEntity.ok(dao.save(account));
    }

    @PutMapping(value = "/rest/authorities/{username}")
    public ResponseEntity<Account> put(@PathVariable("username") String email, @RequestBody Account account) {

        return ResponseEntity.ok(dao.save(account));
    }

    @DeleteMapping("/rest/authorities/{username}")
    public ResponseEntity<Void> delete(@PathVariable("username") String id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Account acc = dao.findById(id).get();
        acc.setAccountRole(null);
        dao.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // @PostMapping(value = "rest/update/img", consumes =
    // MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<Void> uploadIMG(@RequestParam("file") MultipartFile
    // file) {
    // String path = "/asset/img/avatar/";
    // ps.save(file, path);
    // return ResponseEntity.ok().build();
    // }

    @PostMapping("/rest/update/img")
    public ResponseEntity<Void> upload(@RequestParam("file") MultipartFile files) {
        String path = "/asset/img/avatar/";
        prs.save(files, path);
        return ResponseEntity.ok().build();
    }

    // @PutMapping(value = "/rest/update/{username}")
    // public ResponseEntity<Account> updateAccount(@PathVariable("username") String
    // username,
    // @RequestParam(value = "file", required = false) MultipartFile avatarFile,
    // @RequestBody Account updatedAccount) {
    // // // Xử lý lưu ảnh avatar vào thư mục và lấy tên file
    // if (avatarFile != null) {
    // String avatarFileName = username + "_avatar.jpg"; // Tên mới của ảnh avatar
    // // // Lưu ảnh vào thư mục lưu trữ
    // try {
    // String path = "/asset/img/avatar/"; // Thay bằng đường dẫn thư mục lưu trữ
    // // ảnh
    // Path uploadPath = Paths.get(path);
    // if (!Files.exists(uploadPath)) {
    // Files.createDirectories(uploadPath);
    // }
    // Path filePath = uploadPath.resolve(avatarFileName);
    // Files.copy(avatarFile.getInputStream(), filePath,
    // StandardCopyOption.REPLACE_EXISTING);
    // } catch (IOException e) {
    // e.printStackTrace();
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    // }
    // updatedAccount.setAvatarUrl(avatarFileName);
    // }
    // dao.save(updatedAccount);
    // return ResponseEntity.ok(updatedAccount);
    // }

}
