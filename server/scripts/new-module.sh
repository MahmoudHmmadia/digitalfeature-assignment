#!/bin/bash

# Check if name argument is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a name for the module"
    echo "Usage: npm run new-module <name>"
    echo "Example: npm run new-module user"
    exit 1
fi

# Function to pluralize
pluralize() {
    local word="$1"
    case "${word: -1}" in
        s|sh|ch|x|z)
            echo "${word}es"
            ;;
        y)
            if [[ ! ${word: -2:1} =~ [aeiou] ]]; then
                echo "${word%y}ies"
            else
                echo "${word}s"
            fi
            ;;
        *)
            echo "${word}s"
            ;;
    esac
}

# Get the name and convert to proper case
name="$1"
lower_name=$(echo "$name" | tr '[:upper:]' '[:lower:]')
controller_name=$(echo "$name" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
plural_name=$(pluralize "$lower_name")
plural_controller_name=$(echo "$plural_name" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

# Create directories if they don't exist
mkdir -p controllers
mkdir -p validations
mkdir -p routes

echo "🚀 Creating module: $controller_name"

# 1. Create Controller
controller_file="controllers/${lower_name}.controller.ts"
cat > "$controller_file" << CONTROLLER_EOF
import { Request, Response } from "express";
import { serverErrorResponse } from "../utils/responses";

export async function create${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function edit${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function get${plural_controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function get${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function remove${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res , req});
  }
}
CONTROLLER_EOF
echo "✅ Controller created: $controller_file"

# 2. Create Validation Schemas
validation_file="validations/${lower_name}.schemas.ts"
cat > "$validation_file" << VALIDATION_EOF
import Joi from "joi";

export type Create${controller_name}Dto = {

};

export type Edit${controller_name}Dto = {

};

export const create${controller_name}Schema = Joi.object({

});

export const edit${controller_name}Schema = Joi.object({

});
VALIDATION_EOF
echo "✅ Validation schemas created: $validation_file"

# 3. Create Routes
routes_file="routes/${lower_name}.routes.ts"
cat > "$routes_file" << ROUTES_EOF
import { Router } from "express";
import {
  create${controller_name},
  remove${controller_name},
  edit${controller_name},
  get${controller_name},
  get${plural_controller_name},
} from "../controllers/${lower_name}.controller";
import { validate } from "../middleware/validation.middleware";
import {
  create${controller_name}Schema,
  edit${controller_name}Schema,
} from "../validations/${lower_name}.schemas";

const ${lower_name}Routes = Router();


${lower_name}Routes
  .route("/")
  .get(get${plural_controller_name})
  .post(validate(create${controller_name}Schema), create${controller_name})
  .patch(validate(edit${controller_name}Schema), edit${controller_name});

${lower_name}Routes
  .route("/:id")
  .delete(remove${controller_name})
  .get(get${controller_name});

export default ${lower_name}Routes;
ROUTES_EOF
echo "✅ Routes created: $routes_file"

echo ""
echo "🎉 Module '$controller_name' created successfully!"
echo "📁 Files created:"
echo "   - controllers/${lower_name}.controller.ts"
echo "   - validations/${lower_name}.schemas.ts"
echo "   - routes/${lower_name}.routes.ts"
echo ""
echo "📝 Next steps:"
echo "   1. Implement your business logic in the controller"
echo "   2. Define your validation schemas"
echo "   3. Register the routes in your main server file"
echo "   4. Update your DTO types with actual properties"
