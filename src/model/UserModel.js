const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      minlength: [3, "firstname minmam 3 charecters"],
      maxlength: [50, "firstname maximum 50 charecters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [1, "Last name must be at least 1 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],

      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // exactly 10 digits
        },
        message: "Phone number must be exactly 10 digits",
      },
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    fk_role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      // required: [true, "Role is required"],
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
