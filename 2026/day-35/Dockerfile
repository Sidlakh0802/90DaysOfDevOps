

##MULTISTAGE###
# --- Stage 1: Build Stage (The heavy workbench) ---
#FROM node:18 AS builder
#WORKDIR /app
#COPY package*.json ./
# Install ALL dependencies (including dev dependencies if we had them)
#RUN npm install
#COPY . .

# --- Stage 2: Final Production Stage (The minimal display case) ---
#FROM node:18-alpine
#WORKDIR /app
# Copy ONLY the essential built files from Stage 1
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/app.js .
#EXPOSE 3000
#CMD ["node", "app.js"]



###MULTISTAGE WITH NON_ROOT USER###


FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Final Stage
# Best Practice 1: Specific Tags (Not just 'node:18-alpine')
FROM node:18.17.0-alpine3.18 
WORKDIR /app

# Best Practice 2: Non-Root User (Security)
# Create a dedicated user/group and switch to it so the app doesn't run as root
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp \
    # Best Practice 3: Combine RUN commands to reduce layers
    && chown -R nodeapp:nodeapp /app

USER nodeapp

COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/app.js .

EXPOSE 3000
CMD ["node", "app.js"]


