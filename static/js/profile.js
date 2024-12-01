document.addEventListener("DOMContentLoaded", () => {
    // 获取用户信息并填充表单
    fetch("/auth/me")
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Failed to fetch user data");
      })
      .then((data) => {
        const user = data.user;
        
        document.getElementById("username").value = user.username;
        document.getElementById("nickname").value = user.nickname || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("gender").value = user.gender || "";
        document.getElementById("birthdate").value = user.birthdate || "";

        console.log(user.nickname); 
        console.log(user.username); 
        console.log(user.email); 
        console.log(user.gender); 
        console.log(user.birthdate); 
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Please login to access your profile.");
        window.location.href = "/login.html";
      });
  
    // 保存修改
    document.getElementById("save-button").addEventListener("click", async () => {
      const updatedData = {
        nickname: document.getElementById("nickname").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
        birthdate: document.getElementById("birthdate").value,
      };
  
      try {
        const response = await fetch("/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
  
        const result = await response.json();
        if (result.status === "success") {
          alert("Profile updated successfully!");
        } else {
          alert("Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while saving changes.");
      }
    });

   /* 监听重置按钮
   document.getElementById("reset-button").addEventListener("click", () => {
    fetch("/auth/profile")
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Failed to fetch user data");
      })
      .then((data) => {
        const user = data.user;

        // 重置表单字段
        document.getElementById("nickname").value = user.nickname || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("gender").value = user.gender || "";
        document.getElementById("birthdate").value = user.birthdate || "";
      })
      .catch((error) => {
        console.error("Error resetting user data:", error);
        alert("An error occurred while resetting changes.");
      });
  });*/
});